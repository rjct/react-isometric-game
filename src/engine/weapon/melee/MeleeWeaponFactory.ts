import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class MeleeWeapon extends Weapon {
  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity) {
    super(weaponName, weaponDictEntity);
  }
}
