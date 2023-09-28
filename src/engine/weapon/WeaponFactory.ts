import { StaticMapWeapon } from "@src/context/GameStateContext";
import weapons from "@src/dict/weapons.json";
import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { floor, getDistanceBetweenGridPoints, randomUUID } from "@src/engine/helpers";
import { ObstacleRay } from "@src/engine/light/ObstacleRayFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { FirearmRef, FirearmType, FirearmUnitAction } from "@src/engine/weapon/firearm/FirearmFactory";
import { MeleePunch } from "@src/engine/weapon/melee/meleePunchFactory";
import { MeleeUnitAction, MeleeWeaponRef, MeleeWeaponType } from "@src/engine/weapon/melee/MeleeWeaponFactory";

export type WeaponClass = keyof typeof weapons;
export type WeaponType = FirearmType | MeleeWeaponType;
export type WeaponTypes = { [weaponId: string]: Weapon };
export type WeaponRef = FirearmRef | MeleeWeaponRef;
export type WeaponUnitAction = FirearmUnitAction | MeleeUnitAction;

export type WeaponSfxType = "use" | "outOfAmmo";
export type WeaponSfx = {
  [type in WeaponSfxType]: {
    src: string[];
    timeIntervalMs?: number;
  };
};

export class Weapon {
  public readonly type: WeaponType;
  public gameMap: GameMap;

  public readonly title: string;
  public readonly id = randomUUID();
  public readonly className: string[] = [];
  readonly range: number;

  public size = {
    grid: { width: 1, height: 1 },
    screen: { width: 0, height: 0 },
  };

  public owner: Unit | Building | null = null;
  public readonly unitAction: WeaponUnitAction;
  public firedAmmoQueue: MeleePunch[] = [];

  private targetPosition: null | GridCoordinates = null;
  public ray: null | ObstacleRay = null;

  public readonly animationDuration: {
    attack: number;
    attackCompleted: number;
    attackNotAllowed: number;
  };

  public readonly actionPointsConsumption: number;

  private isBusy: boolean;

  public readonly sfx: WeaponSfx = {
    use: {
      src: [],
      timeIntervalMs: -1,
    },
    outOfAmmo: {
      src: [],
      timeIntervalMs: -1,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(targetPosition: GridCoordinates) {
    throw new Error("Method not implemented.");
  }

  constructor(weaponType: WeaponType, weaponRef: WeaponRef, gameMap: GameMap) {
    this.type = weaponType;
    this.gameMap = gameMap;

    this.title = weaponRef.title;
    this.className = [...this.className, ...weaponRef.className];
    this.range = weaponRef.range;
    this.unitAction = weaponRef.unitAction as unknown as WeaponUnitAction;

    this.animationDuration = weaponRef.animationDuration;

    this.actionPointsConsumption = weaponRef.actionPointsConsumption;
    this.isBusy = false;

    this.sfx = weaponRef.sfx;
  }

  assignOwner(owner: Unit | Building) {
    this.owner = owner;
  }

  unAssignOwner() {
    this.owner = null;
  }

  updateReferenceToGameMap(gameMap: GameMap) {
    this.gameMap = gameMap;
  }

  aimAt(position: GridCoordinates) {
    this.targetPosition = position;
    if (this.owner) {
      this.ray = new ObstacleRay(this.owner.position, this.targetPosition);
    }
  }

  stopAiming() {
    this.targetPosition = null;
    this.ray = null;
  }

  isAimed() {
    return !!this.targetPosition;
  }

  getAimCoordinates() {
    return this.targetPosition;
  }

  getDistanceToTarget() {
    if (this.targetPosition && this.owner) {
      return floor(getDistanceBetweenGridPoints(this.owner.position, this.targetPosition));
    }

    return Infinity;
  }

  isReadyToUse() {
    if (!this.owner || !this.targetPosition || this.busy()) return false;

    const distanceToTarget = this.getDistanceToTarget();
    const distanceToRayEnd = this.ray?.getDistanceToRayEndPosition(this.gameMap);

    return distanceToTarget <= this.range && distanceToTarget === distanceToRayEnd;
  }

  setBusy(isBusy: boolean) {
    this.isBusy = isBusy;
  }

  busy() {
    return this.isBusy;
  }

  getJSON() {
    const weaponJson: StaticMapWeapon = {
      class: this.constructor.name as WeaponClass,
      type: this.type,
    };

    return weaponJson;
  }
}
