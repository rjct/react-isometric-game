import { getDistanceBetweenGridPoints, getHumanReadableDirection, randomInt } from "./helpers";
import units from "../dict/units.json";
import { pathFinder } from "./pathFinder";
import { GameMap } from "./GameMap";
import { Weapon, WeaponClass, WeaponUnitAction } from "./weapon/WeaponFactory";
import { GameObjectFactory } from "./GameObjectFactory";
import { ObstacleRay } from "./ObstacleRayFactory";
import { StaticMapUnit, StaticMapWeapon } from "../context/GameStateContext";
import { Firearm } from "./weapon/firearm/FirearmFactory";
import { AmmoClass } from "./weapon/AmmoFactory";
import { UnitFieldOfViewFactory } from "./UnitFieldOfViewFactory";

export type UnitType = keyof typeof units;

export type UnitTypes = { [unitId: string]: Unit };

export interface DictUnit {
  type: UnitType;
  idDead?: boolean;
  direction?: Direction;
  className: string;
  speed: {
    walk: number;
    run: number;
  };
  coolDownTime: number;
  size: {
    grid: Size;
    screen: Size;
  };
  healthPoints: {
    current: number;
    max: number;
  };
  fieldOfView: {
    angle: AngleInDegrees; // Degrees
    range: number;
  };
  animationDuration: {
    hit: number;
    notAllowed: number;
  };
}

export type DictUnits = {
  [unitType in UnitType]: DictUnit;
};

export class Unit extends GameObjectFactory {
  public readonly type;

  public readonly className;

  public angle = 0;

  public readonly speed: {
    walk: number;
    run: number;
  };

  public action:
    | "none"
    | "idle"
    | "walk"
    | "run"
    | "hit"
    | "dead"
    | "punch"
    | "fall"
    | "standup"
    | "die"
    | WeaponUnitAction;

  public healthPoints: {
    current: number;
    max: number;
  };

  public damagePoints = 0;

  public isDead: boolean;

  public path: GridCoordinates[] = [];
  public pathQueue: UnitPathQueue;

  public inventory = {
    backpack: [] as Array<Weapon>,
    leftHand: null as Weapon | null,
    rightHand: null as Weapon | null,
  };

  public currentSelectedAction: "walk" | "run" | "useLeftHand" | "useRightHand" = "walk";

  public readonly coolDownTime: number;
  public coolDownTimer = 0;

  public readonly animationDuration: {
    hit: number;
    notAllowed: number;
  };

  public shadows: Array<{
    blocked: boolean;
    obstacleRay: ObstacleRay;
    opacity: number;
    width: number;
    angle: number;
  }> = [];

  public atGunpoint = false;
  public fieldOfView: UnitFieldOfViewFactory;

  constructor(props: {
    unitType: UnitType;
    position: GridCoordinates;
    action?: Unit["action"];
    isDead?: boolean;
    direction?: Unit["direction"];
  }) {
    const ref = units[props.unitType] as DictUnit;

    super({
      size: ref.size,
      position: props.position,
      direction: props.direction || "left",
      internalColor: "rgba(0,255,255,0.5)",
    });

    this.type = props.unitType;

    this.className = ["unit", ref.className].join(" ");
    this.speed = ref.speed;
    this.coolDownTime = ref.coolDownTime;
    this.animationDuration = ref.animationDuration;

    this.action = props.action || "none";

    this.healthPoints = { ...ref.healthPoints };

    this.isDead = props.isDead === true;

    this.pathQueue = new UnitPathQueue();

    this.fieldOfView = new UnitFieldOfViewFactory({
      position: this.position,
      direction: this.direction,
      fieldOfView: ref.fieldOfView,
    });
  }

  public setPath(path: number[][]) {
    this.path = this.convertPathToCoordinatesArray(path);
  }

  public convertPathToCoordinatesArray(path: number[][]): GridCoordinates[] {
    return path.map((iter) => {
      return { x: iter[0], y: iter[1] };
    });
  }

  public convertCoordinatesToPathArray(coordinates: GridCoordinates[]) {
    return coordinates.map((iter) => [iter.x, iter.y]);
  }

  public clearPath() {
    this.path = [];
  }

  public setDirection(angle: number) {
    this.angle = angle;
    this.direction = getHumanReadableDirection(angle);

    this.fieldOfView.setDirection(angle);
  }

  public setPosition(position: GridCoordinates, mapSize: Size) {
    super.setPosition(position, mapSize);
    this.fieldOfView.setPosition(position);
  }

  public setAction(action: Unit["action"]) {
    this.action = action;
  }

  public isMoving() {
    return this.action !== "none" && this.action !== "idle";
  }

  public isUsingHands() {
    return this.currentSelectedAction === "useLeftHand" || this.currentSelectedAction === "useRightHand";
  }

  public getCurrentWeapon() {
    if (!this.isUsingHands()) return null;

    return this.currentSelectedAction === "useLeftHand" ? this.inventory.leftHand : this.inventory.rightHand;
  }

  public getBackpackItems() {
    return this.inventory.backpack;
  }

  public putItemToInventory(item: Weapon, inventoryType: keyof Unit["inventory"]) {
    if (inventoryType === "backpack") {
      this.inventory.backpack.push(item);
    } else {
      this.inventory[inventoryType] = item;
    }
  }

  public isAllowedToPutItemInInventory(inventoryType: keyof Unit["inventory"]) {
    if (inventoryType === "backpack") return true;

    return this.inventory[inventoryType] === null;
  }

  public removeItemFromInventory(item: Weapon, inventoryType: keyof Unit["inventory"]) {
    const itemOnInventory =
      this.inventory.backpack.find((backpackItem) => backpackItem.id === item.id) ||
      this.inventory.leftHand ||
      this.inventory.rightHand;

    if (itemOnInventory) {
      if (inventoryType === "backpack") {
        const index = this.inventory.backpack.findIndex((item) => item.id === itemOnInventory.id);
        this.inventory.backpack.splice(index, 1);
      } else {
        this.inventory[inventoryType] = null;
      }
    }
  }

  public getInventoryItems() {
    const leftHand = this.inventory.leftHand ? [this.inventory.leftHand] : [];
    const rightHand = this.inventory.rightHand ? [this.inventory.rightHand] : [];

    return [...this.inventory.backpack, ...leftHand, ...rightHand];
  }

  public getInventoryItemById(itemId: string) {
    return this.getInventoryItems().find((item) => item?.id === itemId);
  }

  public takeDamage(damage: number) {
    this.damagePoints = -damage;
    this.healthPoints.current = Math.max(0, this.healthPoints.current - damage);

    this.clearPath();
    this.coolDownTimer = this.coolDownTime;

    if (this.healthPoints.current === 0) {
      this.action = "dead";
      this.isDead = true;
    } else {
      this.action = "hit";

      window.setTimeout(() => {
        this.damagePoints = 0;
        if (!this.isDead) this.action = "none";
      }, this.animationDuration.hit);
    }
  }

  public roam(gameState: GameMap) {
    if (this.coolDownTimer > 0 || this.isMoving()) return;
    const getRandomPosition = (): GridCoordinates => {
      return { x: randomInt(0, gameState.mapSize.width - 1), y: randomInt(0, gameState.mapSize.height - 1) };
    };

    let newPosition = getRandomPosition();

    if (gameState.isCellOccupied(newPosition)) {
      while (gameState.isCellOccupied(newPosition)) {
        newPosition = getRandomPosition();
      }
    }

    const path = pathFinder(gameState.matrix, this.position, newPosition);

    if (path.length > 1) {
      this.setPath(path);

      const roamActions = ["walk", "run"] as Extract<Unit["action"], "walk" | "run">[];
      const randomRoamAction = roamActions[randomInt(0, roamActions.length - 1)];

      this.setAction(randomRoamAction);
      this.coolDownTimer = this.coolDownTime;

      return;
    }

    this.coolDownTimer = 0;
  }

  idle() {
    if (this.coolDownTimer > 0 || this.isMoving()) return;

    this.setAction("idle");
    this.coolDownTimer = this.coolDownTime;
  }

  public cooldown(deltaTime: number) {
    if (this.isMoving()) return;

    this.coolDownTimer = Math.max(0, this.coolDownTimer - deltaTime);
  }

  public stop() {
    this.setAction("none");
    this.clearPath();
  }

  public isEnemyDetected(enemy: Unit) {
    return this.fieldOfView.rays.find((ray) => {
      return ray.collidedWithEntity?.id === enemy.id;
    });
  }

  public calcShadows(gameState: GameMap) {
    if (this.isDead || !gameState.settings.featureEnabled.unitShadow) {
      this.clearShadows();

      return;
    }

    this.shadows = gameState.lights
      .filter((light) => {
        return light.radius >= getDistanceBetweenGridPoints(this.position, light.position);
      })
      .reduce((shadows: Unit["shadows"], light) => {
        const distance = getDistanceBetweenGridPoints(this.position, light.position);
        const obstacleRay = new ObstacleRay(light.position, this.position, true);
        const distanceToRayEnd = obstacleRay.getDistanceToRayEndPosition(gameState, true);
        const angle = obstacleRay.getAngle();

        shadows.push({
          blocked: distance - 1 > distanceToRayEnd,
          obstacleRay,
          opacity: 1 - distance / light.radius,
          width: 0.1 + distance / 5,
          angle: angle.deg + 135,
        });

        return shadows;
      }, []);
  }

  public clearShadows() {
    this.shadows = [];
  }

  public setAtGunpoint(state: boolean) {
    this.atGunpoint = state;
  }

  public getJSON(omitUnitType = false) {
    const conventInventoryItemToJson = (item: Weapon): StaticMapWeapon => {
      const weaponJson: StaticMapWeapon = {
        class: item.constructor.name as WeaponClass,
        type: item.type,
      };

      if (item instanceof Firearm && item.ammoCurrent.length > 0) {
        weaponJson.ammo = {
          class: item.ammoCurrent[0].constructor.name as AmmoClass,
          type: item.ammoCurrent[0].type,
          quantity: item.ammoCurrent.length,
        };
      }

      return weaponJson;
    };

    const json: StaticMapUnit = {
      type: this.type,
      position: this.getRoundedPosition(),
      direction: this.direction,
    };

    if (this.isDead) {
      json.isDead = true;
    }

    if (this.getInventoryItems().length > 0) {
      json.inventory = {} as StaticMapUnit["inventory"];

      if (this.inventory.backpack) {
        json.inventory = {
          ...json.inventory,
          ...{ backpack: this.inventory.backpack.map((backpackItem) => conventInventoryItemToJson(backpackItem)) },
        };
      }

      if (this.inventory.leftHand) {
        json.inventory = { ...json.inventory, ...{ leftHand: conventInventoryItemToJson(this.inventory.leftHand!) } };
      }

      if (this.inventory.rightHand) {
        json.inventory = { ...json.inventory, ...{ rightHand: conventInventoryItemToJson(this.inventory.rightHand!) } };
      }
    }

    if (omitUnitType) {
      delete json.type;
    }

    return json;
  }
}

class UnitPathQueue {
  points: GridCoordinates[];
  currentPos: GridCoordinates;
  destinationPos: GridCoordinates;
  distAlong: number;
  totalDistMoved: number;
  atEnd: boolean;

  constructor() {
    this.points = [];
    this.currentPos = { x: 0, y: 0 };
    this.destinationPos = { x: 0, y: 0 };
    this.distAlong = 0;
    this.totalDistMoved = 0;
    this.atEnd = false;
  }

  moveAlong(deltaTime: number) {
    if (deltaTime > 0) {
      if (this.points.length > 1) {
        const x = this.points[1].x - this.points[0].x;
        const y = this.points[1].y - this.points[0].y;
        const len = Math.sqrt(x * x + y * y);

        if (len - this.distAlong < deltaTime) {
          const lastPoint = this.points.shift();

          deltaTime -= len - this.distAlong;
          this.totalDistMoved += len - this.distAlong;
          this.distAlong = 0;

          return lastPoint;
        }

        const frac = (this.distAlong + deltaTime) / len;
        this.currentPos.x = this.points[0].x + x * frac;
        this.currentPos.y = this.points[0].y + y * frac;
        this.distAlong += deltaTime;
        this.totalDistMoved += deltaTime;
      } else {
        this.currentPos.x = this.points[0].x;
        this.currentPos.y = this.points[0].y;
        this.distAlong = 0;
        this.points = [];
        this.atEnd = true;
      }
    }
  }
}
