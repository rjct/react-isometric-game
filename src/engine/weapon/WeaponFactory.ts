import { Unit } from "../UnitFactory";
import { FirearmRef, FirearmType, FirearmUnitAction } from "./firearm/FirearmFactory";
import { MeleeUnitAction, MeleeWeaponRef, MeleeWeaponType } from "./melee/MeleeWeaponFactory";
import { MeleePunch } from "./melee/meleePunchFactory";
import { getDistanceBetweenGridPoints } from "../helpers";
import { GameMap } from "../GameMap";
import { ObstacleRay } from "../ObstacleRayFactory";

export type WeaponType = FirearmType | MeleeWeaponType;
export type WeaponTypes = { [weaponId: string]: Weapon };
export type WeaponRef = FirearmRef | MeleeWeaponRef;
export type WeaponUnitAction = FirearmUnitAction | MeleeUnitAction;

export class Weapon {
  private gameMap: GameMap;

  public readonly title: string;
  public readonly id = crypto.randomUUID();
  public readonly className: string[] = [];
  readonly range: number;

  public size = {
    grid: { width: 1, height: 1 },
    screen: { width: 0, height: 0 },
  };

  public unit: Unit | null = null;
  public readonly unitAction: WeaponUnitAction;
  public firedAmmoQueue: MeleePunch[] = [];

  private targetPosition: null | GridCoordinates = null;
  public ray: null | ObstacleRay = null;

  public readonly animationDuration: {
    attack: number;
    attackCompleted: number;
    attackNotAllowed: number;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(targetPosition: GridCoordinates) {
    throw new Error("Method not implemented.");
  }

  constructor(weaponRef: WeaponRef, gameMap: GameMap) {
    this.gameMap = gameMap;

    this.title = weaponRef.title;
    this.className = [...this.className, ...weaponRef.className];
    this.range = weaponRef.range;
    this.unitAction = weaponRef.unitAction as unknown as WeaponUnitAction;

    this.animationDuration = weaponRef.animationDuration;
  }

  assignUnit(unit: Unit) {
    this.unit = unit;
  }

  unAssignUnit() {
    this.unit = null;
  }

  updateReferenceToGameMap(gameMap: GameMap) {
    this.gameMap = gameMap;
  }

  aimAt(position: GridCoordinates) {
    this.targetPosition = position;
    if (this.unit) {
      this.ray = new ObstacleRay(this.unit.position, this.targetPosition);
    }
  }

  stopAiming() {
    this.targetPosition = null;
    this.ray = null;
  }

  isAimed() {
    return !!this.targetPosition;
  }

  getDistanceToTarget() {
    if (this.targetPosition && this.unit) {
      return Math.floor(getDistanceBetweenGridPoints(this.unit.position, this.targetPosition));
    }

    return Infinity;
  }

  isReadyToUse() {
    if (!this.unit || !this.targetPosition) return false;

    const distanceToTarget = this.getDistanceToTarget();
    const distanceToRayEnd = this.ray?.getDistanceToRayEndPosition(this.gameMap);

    return distanceToTarget <= this.range && distanceToTarget === distanceToRayEnd;
  }
}
