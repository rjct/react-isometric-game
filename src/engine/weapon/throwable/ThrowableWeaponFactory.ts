import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { createAmmoByName } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class ThrowableWeapon extends Weapon {
  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity) {
    super(weaponName, weaponDictEntity);
  }

  use(targetPosition: GridCoordinates, gameState: GameMap) {
    if (!this.owner) return;

    const unit = this.owner as Unit;
    const currentAttackModeDetails = this.getCurrentAttackModeDetails();

    if (this.isReadyToUse(gameState)) {
      const fakeAmmo = createAmmoByName(this.dictEntity.ammoType as AmmoName, gameState);
      fakeAmmo.loadedInWeapon = this;

      const inventoryType = unit.findInventoryEntityPlaceType(this);

      if (inventoryType) {
        unit.removeItemFromInventory(this, inventoryType);
      }

      this.setBusy(true);

      unit.setAction(this.currentAttackMode);

      setTimeout(() => {
        fakeAmmo.shot(unit.position, targetPosition, gameState);
      }, currentAttackModeDetails.animationDuration.attack);

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, currentAttackModeDetails.animationDuration.attackCompleted);
    }
  }

  onAfterAmmoReachedTarget(_ammo: Ammo, gameState: GameMap) {
    delete gameState.weapon[this.id];
  }
}
