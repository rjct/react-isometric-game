import weapons from "../../../dict/weapons.json";
import { Weapon } from "../WeaponFactory";
import { MeleePunch } from "./meleePunchFactory";
import { GameMap } from "../../GameMap";

export type MeleeWeaponType = keyof typeof weapons.MeleeWeapon;
export type MeleeWeaponRef = (typeof weapons.MeleeWeapon)[MeleeWeaponType];
export type MeleeUnitAction = Pick<(typeof weapons.MeleeWeapon)[MeleeWeaponType], "unitAction">;

export class MeleeWeapon extends Weapon {
  private readonly damage: number;

  constructor(weaponType: MeleeWeaponType, gameMap: GameMap) {
    const ref = weapons.MeleeWeapon[weaponType];

    super(weaponType, ref, gameMap);

    this.damage = ref.damage;
  }

  use(targetPosition: GridCoordinates) {
    if (!this.unit) return;

    const unit = this.unit;

    if (this.isReadyToUse()) {
      const punch = new MeleePunch("punch");

      this.firedAmmoQueue.push(punch);

      unit.setAction(this.unitAction);

      setTimeout(() => {
        punch.shot(unit.position, targetPosition);
      }, this.animationDuration.attack);

      setTimeout(() => {
        unit.setAction("none");
      }, this.animationDuration.attackCompleted);
    } else {
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
      }, this.animationDuration.attackNotAllowed);
    }
  }
}
