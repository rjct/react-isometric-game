import { StaticMapUnit, StaticMapWeapon } from "@src/context/GameStateContext";
import units from "@src/dict/units.json";
import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { GameObjectFactory } from "@src/engine/GameObjectFactory";
import { getDistanceBetweenGridPoints, getHumanReadableDirection, randomInt } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { ObstacleRay } from "@src/engine/light/ObstacleRayFactory";
import { pathFinderAStar } from "@src/engine/unit/pathFinder";
import { UnitFieldOfViewFactory } from "@src/engine/unit/UnitFieldOfViewFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { createAmmoByClassName, createWeaponByClassName } from "@src/engine/weapon/helpers";
import { Weapon, WeaponClass, WeaponType, WeaponUnitAction } from "@src/engine/weapon/WeaponFactory";

export type UnitType = keyof typeof units;
export type UnitTypes = { [unitId: string]: Unit };
export type UnitSfxType = "walkStep" | "hit" | "dead";
export type UnitSfxEntity = {
  src: string[];
  repeatEveryMs?: number;
};
export type UnitShadow = {
  blocked: boolean;
  light: Light;
  opacity: number;
  length: number;
  angle: number;
};

export type UnitMovementMode = Extract<Unit["action"], "walk" | "run">;

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
    grid: Size3D;
    screen: Size2D;
  };
  healthPoints: {
    current: number;
    max: number;
  };
  actionPoints: {
    current: number;
    max: number;
    consumption: {
      walk: number;
      run: number;
      explore: number;
    };
  };
  fieldOfView: {
    angle: AngleInDegrees; // Degrees
    range: number;
  };
  animationDuration: {
    hit: number;
    notAllowed: number;
  };
  sfx: {
    [type in UnitSfxType]: UnitSfxEntity;
  };
  distanceToScreenCenter: number;
}

export type DictUnits = {
  [unitType in UnitType]: DictUnit;
};

export type UnitSfx = {
  [type in UnitSfxType]: DictUnit["sfx"][UnitSfxType] & { currentProgressMs: number };
};

export class Unit extends GameObjectFactory {
  public readonly isHero: boolean;
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

  public actionPoints: {
    current: number;
    readonly max: number;
    readonly consumption: {
      walk: number;
      run: number;
      explore: number;
    };
  };

  public damagePoints = 0;

  public isDead: boolean;

  public path: GridCoordinates[] = [];
  public pathQueue: UnitPathQueue;

  public inventory = {
    main: [] as Array<Weapon>,
    leftHand: null as Weapon | null,
    rightHand: null as Weapon | null,
  };

  public currentMovementMode: UnitMovementMode = "walk";
  public currentSelectedAction: "move" | "explore" | "leftHand" | "rightHand" = "move";

  public readonly coolDownTime: number;
  public coolDownTimer = 0;

  public readonly animationDuration: {
    hit: number;
    notAllowed: number;
  };

  public shadows: Array<UnitShadow> = [];

  public atGunpoint = false;
  public fieldOfView: UnitFieldOfViewFactory;
  public distanceToHero = Infinity;

  public readonly sfx: UnitSfx;

  public distanceToScreenCenter = -1;

  public transferInventoryWithEntity: Unit | Building | null = null;

  constructor(props: {
    gameState: GameMap;
    unitType: UnitType;
    position: GridCoordinates;
    isHero: boolean;
    action?: Unit["action"];
    isDead?: boolean;
    direction?: Unit["direction"];
    inventory?: StaticMapUnit["inventory"];
  }) {
    const ref = units[props.unitType] as DictUnit;

    super({
      gameState: props.gameState,
      size: ref.size,
      position: props.position,
      direction: props.direction || "left",
      internalColor: props.isHero ? "rgba(255,255,255,0.5)" : "rgba(255,0,0,0.5)",
    });

    this.isHero = props.isHero;
    this.type = props.unitType;

    this.className = ["unit", ref.className].join(" ");
    this.speed = ref.speed;
    this.coolDownTime = ref.coolDownTime;
    this.animationDuration = ref.animationDuration;

    this.action = props.action || "none";

    this.healthPoints = { ...ref.healthPoints };
    this.actionPoints = { ...ref.actionPoints };

    this.isDead = props.isDead === true;

    this.pathQueue = new UnitPathQueue();

    this.fieldOfView = new UnitFieldOfViewFactory({
      position: this.position,
      direction: this.direction,
      fieldOfView: ref.fieldOfView,
    });

    this.sfx = Object.keys(ref.sfx).reduce(
      (acc, key) => {
        const k = key as UnitSfxType;

        acc[k] = { ...ref.sfx[k], ...{ currentProgressMs: 0 } };

        return acc;
      },
      {} as unknown as UnitSfx,
    );

    if (props.inventory) {
      this.createUnitInventory(props.inventory);
    }
  }

  private createWeaponForUnit(inventoryType: keyof Unit["inventory"], staticWeapon: StaticMapWeapon) {
    const weapon = createWeaponByClassName(staticWeapon.class as WeaponClass, staticWeapon.type as WeaponType);

    if (staticWeapon.ammo && weapon instanceof Firearm) {
      const ammo = staticWeapon.ammo;

      weapon.ammoCurrent = Array.from({ length: ammo.quantity }, () => createAmmoByClassName(ammo.class, ammo?.type));
    }

    weapon.assignOwner(this);

    this.putItemToInventory(weapon, inventoryType);

    this.gameState.weapon[weapon.id] = weapon;
    weapon.updateReferenceToGameMap(this.gameState);
  }

  private createUnitInventory(inventory: StaticMapUnit["inventory"]) {
    if (!inventory) return;

    Object.entries(inventory).forEach(([inventoryType, staticWeapon]) => {
      if (Array.isArray(staticWeapon)) {
        staticWeapon.forEach((iter) => {
          this.createWeaponForUnit(inventoryType as keyof Unit["inventory"], iter);
        });
      } else {
        this.createWeaponForUnit(inventoryType as keyof Unit["inventory"], staticWeapon);
      }
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
    this.pathQueue.points = [];
    this.path = [];
  }

  public setDirection(angle: number) {
    this.angle = angle;
    this.direction = getHumanReadableDirection(angle);

    this.fieldOfView.setDirection(angle);
  }

  public getCurrentSpeed() {
    return this.action === "run" ? this.speed.run : this.speed.walk;
  }

  public setPosition(position: GridCoordinates, gameState: GameMap, deltaTime = -1) {
    super.setPosition(position, gameState);
    this.fieldOfView.setPosition(position);

    const hero = gameState.getHero();

    this.distanceToHero = !hero ? Infinity : this.getDistanceToEntity(hero);

    if (deltaTime > -1) {
      if (
        this.sfx["walkStep"].currentProgressMs === 0 ||
        this.sfx["walkStep"].currentProgressMs >= this.sfx["walkStep"].repeatEveryMs! / this.getCurrentSpeed()
      ) {
        gameState.playSfx(
          this.sfx["walkStep"].src,
          this.id === hero.id ? 1 : 1 - Math.min(100, (this.distanceToHero * 100) / hero.fieldOfView.range) / 100,
          this.distanceToScreenCenter,
        );

        if (this.sfx["walkStep"].currentProgressMs > 0) {
          this.sfx["walkStep"].currentProgressMs = 0;
        }
      }

      this.sfx["walkStep"].currentProgressMs += deltaTime * 1000;
    }
  }

  public setPositionComplete() {
    this.sfx["walkStep"].currentProgressMs = 0;
  }

  public setAction(action: Unit["action"]) {
    this.action = action;
  }

  public isMoving() {
    return this.action !== "none" && this.action !== "idle";
  }

  public isUsingHands() {
    return this.currentSelectedAction === "leftHand" || this.currentSelectedAction === "rightHand";
  }

  public getCurrentWeapon() {
    if (!this.isUsingHands()) return null;

    return this.currentSelectedAction === "leftHand" ? this.inventory.leftHand : this.inventory.rightHand;
  }

  public getFirstAvailableWeaponInHands(): {
    hand: Exclude<keyof Unit["inventory"], "main">;
    weapon: Weapon;
  } | null {
    if (this.inventory.leftHand instanceof Weapon) {
      return { hand: "leftHand", weapon: this.inventory.leftHand };
    }

    if (this.inventory.rightHand instanceof Weapon) {
      return { hand: "rightHand", weapon: this.inventory.rightHand };
    }

    return null;
  }

  public getBackpackItems() {
    return this.inventory.main;
  }

  public putItemToInventory(item: Weapon, inventoryType: keyof Unit["inventory"]) {
    if (inventoryType === "main") {
      this.inventory.main.push(item);
    } else {
      this.inventory[inventoryType] = item;
    }
  }

  public isAllowedToPutItemInInventory(inventoryType: keyof Unit["inventory"]) {
    if (inventoryType === "main") return true;

    return this.inventory[inventoryType] === null;
  }

  public findInventoryEntityPlaceType(entity: Weapon): keyof Unit["inventory"] | null {
    if (this.inventory.main.find((backpackItem) => backpackItem.id === entity.id)) {
      return "main";
    }

    if (this.inventory.leftHand?.id === entity.id) {
      return "leftHand";
    }

    if (this.inventory.rightHand?.id === entity.id) {
      return "rightHand";
    }

    return null;
  }

  public removeItemFromInventory(item: Weapon, inventoryType: keyof Unit["inventory"]) {
    const itemOnInventory =
      this.inventory.main.find((backpackItem) => backpackItem.id === item.id) ||
      this.inventory.leftHand ||
      this.inventory.rightHand;

    if (itemOnInventory) {
      if (inventoryType === "main") {
        const index = this.inventory.main.findIndex((item) => item.id === itemOnInventory.id);
        this.inventory.main.splice(index, 1);
      } else {
        this.inventory[inventoryType] = null;
      }
    }
  }

  public getInventoryItems() {
    const leftHand = this.inventory.leftHand ? [this.inventory.leftHand] : [];
    const rightHand = this.inventory.rightHand ? [this.inventory.rightHand] : [];

    return [...this.inventory.main, ...leftHand, ...rightHand];
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
      this.gameState.playSfx(this.sfx["dead"].src, this.distanceToScreenCenter);

      this.action = "dead";
      this.isDead = true;
    } else {
      this.gameState.playSfx(this.sfx["hit"].src, this.distanceToScreenCenter);
      this.action = "hit";

      window.setTimeout(() => {
        this.damagePoints = 0;
        this.action = "none";
      }, this.animationDuration.hit);
    }
  }

  public setDistanceToScreenCenter(distanceToScreenCenter: number) {
    this.distanceToScreenCenter = distanceToScreenCenter;
  }

  public consumeActionPoints(actionPoints: number) {
    this.actionPoints.current = Math.max(0, this.actionPoints.current - actionPoints);
  }

  public restoreActionPoints() {
    this.actionPoints.current = this.actionPoints.max;
  }

  public getCurrentActionPointsConsumption() {
    switch (this.currentSelectedAction) {
      case "move":
        return this.actionPoints.consumption[this.currentMovementMode];

      case "leftHand":
      case "rightHand":
        const weapon = this.getCurrentWeapon();

        if (weapon) {
          return weapon.actionPointsConsumption;
        }

        return 0;

      case "explore":
        return this.actionPoints.consumption.explore;
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

    const path = pathFinderAStar(gameState.matrix, this.position, newPosition);

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
      .filter((light) => light.radius >= getDistanceBetweenGridPoints(this.position, light.position))
      .map((light) => {
        const distance = getDistanceBetweenGridPoints(this.position, light.position);
        const obstacleRay = new ObstacleRay(light.position, this.position, true);
        const distanceToRayEnd = obstacleRay.getDistanceToRayEndPosition(gameState, true);

        return {
          light,
          blocked: distance - 1 > distanceToRayEnd,
          opacity: 1 - distance / light.radius - 0.1,
          length: Number((0.1 + distance / 5).toFixed(1)),
          angle: obstacleRay.getAngle().deg + 135,
        };
      });
  }

  public clearShadows() {
    this.shadows = [];
  }

  public setAtGunpoint(state: boolean) {
    this.atGunpoint = state;
  }

  public getDistanceToEntity(entity: Unit | Building) {
    return getDistanceBetweenGridPoints(this.getRoundedPosition(), entity.getRoundedPosition());
  }

  public startTransferInventory(entity: Unit | Building) {
    this.transferInventoryWithEntity = entity;
  }

  public stopTransferInventory() {
    this.transferInventoryWithEntity = null;
  }

  public getJSON(omitUnitType = false) {
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

      if (this.inventory.main) {
        json.inventory = {
          ...json.inventory,
          ...{ main: this.inventory.main.map((backpackItem) => backpackItem.getJSON()) },
        };
      }

      if (this.inventory.leftHand) {
        json.inventory = { ...json.inventory, ...{ leftHand: this.inventory.leftHand.getJSON() } };
      }

      if (this.inventory.rightHand) {
        json.inventory = { ...json.inventory, ...{ rightHand: this.inventory.rightHand.getJSON() } };
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
