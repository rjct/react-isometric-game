import weapons from "../../../dict/weapons.json";
import { Weapon } from "../WeaponFactory";
import { MeleePunch } from "./meleePunchFactory";
import { getDistanceBetweenGridPoints } from "../../helpers";

export type MeleeWeaponType = keyof typeof weapons.melee;
export type MeleeWeaponRef = (typeof weapons.melee)[MeleeWeaponType];
export type MeleeUnitAction = Pick<(typeof weapons.melee)[MeleeWeaponType], "unitAction">;

export class MeleeWeapon extends Weapon {
  private readonly damage: number;

  constructor(weaponType: MeleeWeaponType) {
    const ref = weapons.melee[weaponType];

    super(ref);

    this.damage = ref.damage;
  }

  use(targetPosition: Coordinates) {
    if (!this.unit) return;

    const unit = this.unit;

    if (Math.floor(getDistanceBetweenGridPoints(unit.position, targetPosition)) <= this.range) {
      const punch = new MeleePunch("punch");

      this.firedAmmoQueue.push(punch);

      unit.setAction(this.unitAction);

      setTimeout(() => {
        punch.shot(unit.position, targetPosition);
      }, 400);

      setTimeout(() => {
        unit.setAction("none");
      }, 1000);
    } else {
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
      }, 1000);
    }
  }
}
