import weapons from "../../dict/weapons.json";
import { Ammo, AmmoType } from "../AmmoFactory";
import { getDistanceBetweenGridPoints } from "../helpers";
import { Weapon } from "./WeaponFactory";

export type WeaponType = keyof typeof weapons;

export class Firearm extends Weapon {
  ammoCurrent: Ammo[];

  readonly ammoType: AmmoType;
  readonly ammoCapacity: number;
  readonly ammoConsumptionPerShoot: number;
  readonly range: number;

  firedAmmoQueue: Ammo[] = [];

  constructor(weaponType: WeaponType) {
    super(weaponType);
    const ref = weapons[weaponType];

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

      this.firedAmmoQueue.push(ammo);

      count++;

      if (count === this.ammoConsumptionPerShoot) clearInterval(fireInterval);
    };

    if (Math.floor(getDistanceBetweenGridPoints(unit.position, targetPosition)) <= this.range) {
      fireInterval = window.setInterval(doFire, 250);
    }
  }
}
