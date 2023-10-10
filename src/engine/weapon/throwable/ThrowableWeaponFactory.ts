import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { createAmmoByName } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class ThrowableWeapon extends Weapon {
  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity) {
    super(weaponName, weaponDictEntity);
  }

  use(targetPosition: GridCoordinates, gameState: GameMap) {
    if (!this.owner) return;

    const fakeAmmo = createAmmoByName(this.dictEntity.ammoType as AmmoName, gameState);
    fakeAmmo.loadedInWeapon = this;

    fakeAmmo.shot(this.owner.position, targetPosition, gameState);

    const inventoryType = this.owner.findInventoryEntityPlaceType(this);

    if (inventoryType) {
      this.owner.removeItemFromInventory(this, inventoryType);
    }
  }

  onAfterAmmoReachedTarget(ammo: Ammo, gameState: GameMap) {
    delete gameState.weapon[this.id];
  }
}
