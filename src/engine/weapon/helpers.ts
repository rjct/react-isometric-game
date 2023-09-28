import { AmmoClass, AmmoType } from "@src/engine/weapon/AmmoFactory";
import { FirearmAmmo } from "@src/engine/weapon/firearm/FirearmAmmoFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { MeleePunch } from "@src/engine/weapon/melee/meleePunchFactory";
import { MeleeWeapon } from "@src/engine/weapon/melee/MeleeWeaponFactory";
import { WeaponClass, WeaponType } from "@src/engine/weapon/WeaponFactory";

export function createWeaponByClassName(weaponClass: WeaponClass, weaponType: WeaponType) {
  const weaponDict = {
    MeleeWeapon,
    Firearm,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new weaponDict[weaponClass](weaponType, this);
}

export function createAmmoByClassName(ammoClass: AmmoClass, ammoType: AmmoType) {
  const weaponDict = {
    MeleePunch,
    FirearmAmmo,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new weaponDict[ammoClass](ammoType, this);
}
