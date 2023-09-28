import weapons from "@src/dict/weapons.json";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { MeleePunch } from "@src/engine/weapon/melee/meleePunchFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

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
    if (!this.owner) return;

    const unit = this.owner as Unit;

    if (!(unit instanceof Unit)) return;

    if (this.isReadyToUse()) {
      this.gameMap.playSfx(this.sfx.use.src, 1, unit.distanceToScreenCenter);

      const punch = new MeleePunch("punch");

      this.setBusy(true);
      this.firedAmmoQueue.push(punch);

      unit.setAction(this.unitAction);

      setTimeout(() => {
        punch.shot(unit.position, targetPosition);
      }, this.animationDuration.attack);

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, this.animationDuration.attackCompleted);
    } else {
      this.setBusy(true);
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, this.animationDuration.attackNotAllowed);
    }
  }
}
