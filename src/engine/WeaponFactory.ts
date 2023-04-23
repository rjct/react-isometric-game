import weapons from "../dict/weapons.json";
import { nanoid } from "nanoid";
import { Unit } from "./UnitFactory";
import { Ammo, AmmoType } from "./AmmoFactory";
import { getDistanceBetweenGridPoints } from "./helpers";

export type WeaponType = keyof typeof weapons;

export class Weapon {
  public readonly title: string;
  public readonly id = nanoid();
  public readonly className: string[] = [];

  public size = {
    grid: { width: 1, height: 1 },
    screen: { width: 0, height: 0 },
  };

  ammoCurrent: Ammo[];

  readonly ammoType: AmmoType;
  readonly ammoCapacity: number;
  readonly ammoConsumptionPerShoot: number;
  readonly range: number;

  private unit: Unit | null = null;

  constructor(weaponType: WeaponType) {
    const ref = weapons[weaponType];

    this.title = ref.title;
    this.className = [...this.className, ...ref.className];

    this.ammoType = ref.ammoType as AmmoType;
    this.ammoCurrent = [];
    this.ammoCapacity = ref.ammoCapacity;
    this.ammoConsumptionPerShoot = ref.ammoConsumptionPerShoot;
    this.range = ref.range;
  }

  fire(targetPosition: Coordinates) {
    if (this.ammoCurrent.length === 0 || !this.unit) return;

    const unit = this.unit;
    let count = 0;
    let fireInterval: number;

    const doFire = () => {
      const ammo = this.ammoCurrent.shift() as Ammo;

      ammo.shot(unit.position, targetPosition);

      unit.firedAmmoQueue.push(ammo);

      count++;

      if (count === this.ammoConsumptionPerShoot) clearInterval(fireInterval);
    };

    if (Math.floor(getDistanceBetweenGridPoints(unit.position, targetPosition)) <= this.range) {
      fireInterval = window.setInterval(doFire, 250);
    }
  }

  assignUnit(unit: Unit) {
    this.unit = unit;
  }

  unassignUnit() {
    this.unit = null;
  }
}
