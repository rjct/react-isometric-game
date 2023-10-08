import ammoList, { AmmoDictEntity, AmmoName, WeaponAmmoClass } from "@src/dict/ammo/ammo";
import weaponList, { WeaponClass, WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { randomInt } from "@src/engine/helpers";
import { Ammo, AmmoFactory } from "@src/engine/weapon/AmmoFactory";
import { FirearmAmmo } from "@src/engine/weapon/firearm/FirearmAmmoFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { MeleePunch } from "@src/engine/weapon/melee/meleePunchFactory";
import { MeleeWeapon } from "@src/engine/weapon/melee/MeleeWeaponFactory";
import { ProjectileAmmo } from "@src/engine/weapon/throwable/ProjectileAmmoFactory";
import { ThrowableWeapon } from "@src/engine/weapon/throwable/ThrowableWeaponFactory";
import { Weapon, WeaponFactory } from "@src/engine/weapon/WeaponFactory";

export function getWeaponDictEntityByName(weaponName: WeaponName): WeaponDictEntity {
  return weaponList[weaponName];
}

export function createWeaponByName(weaponName: WeaponName, gameState: GameMap) {
  const weaponFactoryDict: { [weaponClass in WeaponClass]: WeaponFactory } = {
    melee: MeleeWeapon,
    firearm: Firearm,
    throwable: ThrowableWeapon,
  };

  const weaponDictEntity = getWeaponDictEntityByName(weaponName);

  return new weaponFactoryDict[weaponDictEntity.class](weaponName, weaponDictEntity, gameState);
}

//
export function getAmmoDictEntityByName(ammoName: AmmoName): AmmoDictEntity {
  return ammoList[ammoName];
}

export function createAmmoByName(ammoName: AmmoName, gameState: GameMap) {
  const ammoFactoryDict: { [weaponAmmoClass in WeaponAmmoClass]: AmmoFactory } = {
    firearm_ammo: FirearmAmmo,
    grenade_ammo: ProjectileAmmo,
    melee_ammo: MeleePunch,
  };

  const ammoDictEntity = getAmmoDictEntityByName(ammoName);

  return new ammoFactoryDict[ammoDictEntity.class](ammoName, ammoDictEntity, gameState);
}

export function calcDamage(weapon: Weapon, ammo: Ammo) {
  const weaponDamageMinMax = weapon.getCurrentAttackModeDetails().damage;
  const weaponDamage = randomInt(weaponDamageMinMax.min, weaponDamageMinMax.max);
  const ammoDamage = ammo.dictEntity.damage;

  return Math.round(weaponDamage + weaponDamage * (ammoDamage / 100));
}

export function itemIsWeapon(item: Weapon | Ammo): item is Weapon {
  return item instanceof Weapon;
}
