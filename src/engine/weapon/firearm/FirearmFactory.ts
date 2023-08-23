import weapons from "../../../dict/weapons.json";
import { Ammo, AmmoType } from "../AmmoFactory";
import { Weapon } from "../WeaponFactory";
import { GameMap } from "../../GameMap";

export type FirearmType = keyof typeof weapons.Firearm;
export type FirearmRef = (typeof weapons.Firearm)[FirearmType];
export type FirearmUnitAction = Pick<(typeof weapons.Firearm)[FirearmType], "unitAction">;

export class Firearm extends Weapon {
  ammoCurrent: Ammo[];

  readonly ammoType: AmmoType;
  readonly ammoCapacity: number;
  readonly ammoConsumptionPerShoot: number;

  constructor(weaponType: FirearmType, gameMap: GameMap) {
    const ref = weapons.Firearm[weaponType];

    super(weaponType, ref, gameMap);

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
          this.setBusy(false);
        }, this.animationDuration.attackCompleted);
      }
    };

    if (this.isReadyToUse() && this.ammoCurrent.length > 0) {
      this.setBusy(true);
      this.gameMap.playSfx(this.sfx.use.src, 1);
      fireInterval = window.setInterval(doFire, this.sfx.use.timeIntervalMs);
    } else {
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, this.animationDuration.attackNotAllowed);
    }
  }
}
