import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { createAmmoByName } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class ThrowableWeapon extends Weapon {
  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity, gameMap: GameMap) {
    super(weaponName, weaponDictEntity, gameMap);
  }

  use(targetPosition: GridCoordinates) {
    if (!this.owner) return;

    const fakeAmmo = createAmmoByName(this.dictEntity.ammoType as AmmoName, this.gameMap);

    fakeAmmo.shot(this.owner.position, targetPosition);
    this.firedAmmoQueue.push(fakeAmmo);

    //
    const inventoryType = this.owner.findInventoryEntityPlaceType(this);

    if (inventoryType) {
      // this.owner.removeItemFromInventory(this, inventoryType);
      // this.unAssignOwner();
      //delete this.gameMap.weapon[this.id];
    }
  }
}
