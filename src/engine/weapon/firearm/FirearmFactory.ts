import weapons from "../../../dict/weapons.json";
import { Ammo, AmmoType } from "../AmmoFactory";
import { Weapon } from "../WeaponFactory";
import { GameMap } from "../../GameMap";

export type FirearmType = keyof typeof weapons.firearm;
export type FirearmRef = (typeof weapons.firearm)[FirearmType];
export type FirearmUnitAction = Pick<(typeof weapons.firearm)[FirearmType], "unitAction">;

export class Firearm extends Weapon {
  ammoCurrent: Ammo[];

  readonly ammoType: AmmoType;
  readonly ammoCapacity: number;
  readonly ammoConsumptionPerShoot: number;

  constructor(weaponType: FirearmType, gameMap: GameMap) {
    const ref = weapons.firearm[weaponType];

    super(ref, gameMap);

    this.ammoType = ref.ammoType as AmmoType;
    this.ammoCurrent = [];
    this.ammoCapacity = ref.ammoCapacity;
    this.ammoConsumptionPerShoot = ref.ammoConsumptionPerShoot;
  }

  use(targetPosition: GridCoordinates) {
    if (!this.unit) return;

    const unit = this.unit;
    let count = 0;
    let fireInterval: number;

    const doFire = () => {
      const ammo = this.ammoCurrent.shift() as Ammo;

      ammo.shot(unit.position, targetPosition);

      this.firedAmmoQueue.push(ammo);

      count++;

      if (count === this.ammoConsumptionPerShoot) {
        clearInterval(fireInterval);

        setTimeout(() => {
          unit.setAction("none");
        }, this.animationDuration.attackCompleted);
      }
    };

    if (this.isReadyToUse() && this.ammoCurrent.length > 0) {
      fireInterval = window.setInterval(doFire, 250);
    } else {
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
      }, this.animationDuration.attackNotAllowed);
    }
  }
}
