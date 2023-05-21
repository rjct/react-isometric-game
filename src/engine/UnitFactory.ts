import { getHumanReadableDirection, randomInt } from "./helpers";
import unitTypes from "../dict/units.json";
import { Weapon } from "./WeaponFactory";
import { Ammo } from "./AmmoFactory";
import { constants } from "../constants";
import { pathFinder } from "./pathFinder";
import { GameMap } from "./GameMap";

export type UnitTypes = { [unitId: string]: Unit };

export class Unit {
  public readonly type;
  public readonly id;
  public readonly className;

  public readonly speed: {
    walk: number;
    run: number;
  };

  public direction: Direction;
  public action: "none" | "idle" | "walk" | "run" | "hit" | "dead";

  public actionPoints: {
    current: number;
    max: number;
  };

  public healthPoints: {
    current: number;
    max: number;
  };

  public damagePoints = 0;

  public isDead: boolean;

  public position = { x: 0, y: 0 };
  public readonly size = {
    grid: { width: 0, height: 0 },
    screen: { width: 0, height: 0 },
  };

  public path: Coordinates[] = [];
  public pathQueue: UnitPathQueue;

  public inventory = {
    backpack: [] as Weapon[],
    leftHand: null as Weapon | null,
    rightHand: null as Weapon | null,
  };

  public firedAmmoQueue: Ammo[] = [];

  public currentSelectedAction: "walk" | "run" | "useLeftHand" | "useRightHand" = "walk";

  private readonly coolDownTime: number;
  private coolDownTimer = 0;

  public enemyDetectionRange: number;

  constructor(props: {
    unitType: keyof typeof unitTypes;
    position: Coordinates;
    action?: Unit["action"];
    direction?: Unit["direction"];
  }) {
    const ref = unitTypes[props.unitType];

    this.id = crypto.randomUUID();
    this.type = props.unitType;
    this.size = ref.size;
    this.className = ["unit", ref.className].join(" ");
    this.size = ref.size;
    this.speed = ref.speed;
    this.coolDownTime = ref.coolDownTime;
    this.direction = props.direction || "left";
    this.action = props.action || "none";
    this.enemyDetectionRange = ref.enemyDetectionRange;

    this.actionPoints = { ...ref.actionPoints };
    this.healthPoints = { ...ref.healthPoints };
    this.isDead = false;

    this.position = props.position;
    this.pathQueue = new UnitPathQueue();
  }

  setPosition(position: Unit["position"]) {
    this.position = position;
  }

  getRoundedPosition() {
    return {
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
    };
  }

  public setPath(path: number[][]) {
    this.path = this.convertPathToCoordinatesArray(path);
  }

  public convertPathToCoordinatesArray(path: number[][]): Coordinates[] {
    return path.map((iter) => {
      return { x: iter[0], y: iter[1] };
    });
  }

  public convertCoordinatesToPathArray(coordinates: Coordinates[]) {
    return coordinates.map((iter) => [iter.x, iter.y]);
  }

  public clearPath() {
    this.path = [];
  }

  public setDirection(angle: number) {
    this.direction = getHumanReadableDirection(angle);
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

  public getInventoryItemById(itemId: string) {
    const leftHand = [this.inventory.leftHand];
    const rightHand = [this.inventory.rightHand];

    return [...this.inventory.backpack, ...leftHand, ...rightHand].filter(Boolean).find((item) => item?.id === itemId);
  }

  public takeDamage(ammo: Ammo) {
    this.damagePoints = -ammo.damage;
    this.healthPoints.current = Math.max(0, this.healthPoints.current - ammo.damage);

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
      }, constants.unit_css_animation_length);
    }
  }

  public roam(gameState: GameMap) {
    if (this.coolDownTimer > 0 || this.isMoving()) return;
    const getRandomPosition = (): Coordinates => {
      return { x: randomInt(0, gameState.mapSize.width - 1), y: randomInt(0, gameState.mapSize.height - 1) };
    };

    let newPosition = getRandomPosition();

    if (gameState.isCellOccupied(newPosition.x, newPosition.y)) {
      while (gameState.isCellOccupied(newPosition.x, newPosition.y)) {
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
}

class UnitPathQueue {
  points: Coordinates[];
  currentPos: Coordinates;
  destinationPos: Coordinates;
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
          this.moveAlong(deltaTime);

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
