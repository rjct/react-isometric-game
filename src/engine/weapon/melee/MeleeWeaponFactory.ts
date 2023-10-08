import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { createAmmoByName } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class MeleeWeapon extends Weapon {
  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity, gameMap: GameMap) {
    super(weaponName, weaponDictEntity, gameMap);
  }

  use(targetPosition: GridCoordinates) {
    if (!this.owner) return;

    const unit = this.owner as Unit;
    const currentAttackModeDetails = this.getCurrentAttackModeDetails();

    if (this.isReadyToUse()) {
      this.gameMap.playSfx(this.getSfx(this.currentAttackMode).src, 1, unit.distanceToScreenCenter);

      const fakeAmmo = createAmmoByName(this.dictEntity.ammoType as AmmoName, this.gameMap);

      this.setBusy(true);

      unit.setAction(this.currentAttackMode);

      setTimeout(() => {
        this.firedAmmoQueue.push(fakeAmmo);
        fakeAmmo.shot(unit.position, targetPosition);
      }, currentAttackModeDetails.animationDuration.attack);

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, currentAttackModeDetails.animationDuration.attackCompleted);
    } else {
      this.setBusy(true);
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, currentAttackModeDetails.animationDuration.attackNotAllowed);
    }
  }
}
