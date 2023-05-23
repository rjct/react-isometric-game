import weapons from "../../dict/weapons.json";
import { Unit } from "../UnitFactory";

export type WeaponType = keyof typeof weapons;

export class Weapon {
  public readonly title: string;
  public readonly id = crypto.randomUUID();
  public readonly className: string[] = [];

  public size = {
    grid: { width: 1, height: 1 },
    screen: { width: 0, height: 0 },
  };

  readonly range: number;

  public unit: Unit | null = null;

  constructor(weaponType: WeaponType) {
    const ref = weapons[weaponType];

    this.title = ref.title;
    this.className = [...this.className, ...ref.className];

    this.range = ref.range;
  }

  assignUnit(unit: Unit) {
    this.unit = unit;
  }

  unassignUnit() {
    this.unit = null;
  }
}
