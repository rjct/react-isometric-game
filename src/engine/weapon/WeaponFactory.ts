import { Unit } from "../UnitFactory";
import { FirearmRef, FirearmType, FirearmUnitAction } from "./firearm/FirearmFactory";
import { MeleeUnitAction, MeleeWeaponRef, MeleeWeaponType } from "./melee/MeleeWeaponFactory";
import { MeleePunch } from "./melee/meleePunchFactory";

export type WeaponType = FirearmType | MeleeWeaponType;
export type WeaponRef = FirearmRef | MeleeWeaponRef;
export type WeaponUnitAction = FirearmUnitAction | MeleeUnitAction;

export class Weapon {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(targetPosition: Coordinates) {
    throw new Error("Method not implemented.");
  }

  constructor(weaponRef: WeaponRef) {
    this.title = weaponRef.title;
    this.className = [...this.className, ...weaponRef.className];
    this.range = weaponRef.range;
    this.unitAction = weaponRef.unitAction as unknown as WeaponUnitAction;
  }

  assignUnit(unit: Unit) {
    this.unit = unit;
  }

  unassignUnit() {
    this.unit = null;
  }
}
