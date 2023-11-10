import getAmmoDictList, { AmmoName, getAmmoDictEntityByName, WeaponAmmoClass } from "@src/dict/ammo/ammo";
import getWeaponDictList, { WeaponClass, WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { degToRad, randomInt } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo, AmmoFactory } from "@src/engine/weapon/AmmoFactory";
import { FirearmAmmo } from "@src/engine/weapon/firearm/FirearmAmmoFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { MeleePunch } from "@src/engine/weapon/melee/meleePunchFactory";
import { MeleeWeapon } from "@src/engine/weapon/melee/MeleeWeaponFactory";
import { ProjectileAmmo } from "@src/engine/weapon/throwable/ProjectileAmmoFactory";
import { ThrowableWeapon } from "@src/engine/weapon/throwable/ThrowableWeaponFactory";
import { Weapon, WeaponFactory } from "@src/engine/weapon/WeaponFactory";

export function getItemDictEntityByName<T extends WeaponName | AmmoName>(name: T) {
  const weaponList = getWeaponDictList();
  const ammoList = getAmmoDictList();

  switch (true) {
    case !!weaponList[name]:
      return {
        class: "weapon",
        entity: weaponList[name],
      };

    case !!ammoList[name]:
      return {
        class: "ammo",
        entity: ammoList[name],
      };
  }
}

export function createInventoryItemByName(name: WeaponName | AmmoName) {
  const dictEntity = getItemDictEntityByName(name);

  switch (dictEntity.class) {
    case "weapon":
      return createWeaponByName(dictEntity.entity.name);

    case "ammo":
    default:
      return createAmmoByName(dictEntity.entity.name);
  }
}

export function getWeaponDictEntityByName(weaponName: WeaponName): WeaponDictEntity {
  return getWeaponDictList()[weaponName];
}

export function createWeaponByName(weaponName: WeaponName) {
  const weaponFactoryDict: { [weaponClass in WeaponClass]: WeaponFactory } = {
    melee: MeleeWeapon,
    firearm: Firearm,
    throwable: ThrowableWeapon,
  };

  const weaponDictEntity = getWeaponDictEntityByName(weaponName);

  return new weaponFactoryDict[weaponDictEntity.class](weaponName, weaponDictEntity);
}

//
export function createAmmoByName(ammoName: AmmoName) {
  const ammoFactoryDict: { [weaponAmmoClass in WeaponAmmoClass]: AmmoFactory } = {
    firearm_ammo: FirearmAmmo,
    grenade_ammo: ProjectileAmmo,
    melee_ammo: MeleePunch,
  };

  const ammoDictEntity = getAmmoDictEntityByName(ammoName);

  return new ammoFactoryDict[ammoDictEntity.class](ammoName, ammoDictEntity);
}

export function calcDamage(unit: Unit, weapon: Weapon, ammo: Ammo) {
  const currentAttackModeDetails = weapon.getCurrentAttackModeDetails();

  const weaponDamageMinMax = currentAttackModeDetails.damage;
  const weaponDamage = randomInt(weaponDamageMinMax.min, weaponDamageMinMax.max);
  const ammoDamage = ammo.dictEntity.damage;
  const skillDamage =
    weapon instanceof MeleeWeapon && weapon.currentAttackMode === "punch"
      ? unit.characteristics.derived.meleeDamage.value
      : 0;

  return Math.round(weaponDamage + weaponDamage * (ammoDamage / 100)) + skillDamage;
}

export function itemIsWeapon(item: Weapon | Ammo): item is Weapon {
  return item instanceof Weapon;
}

export function calculateSizeAfterRotation(size: Size3D, rotation: Angle) {
  const { width, length } = size;
  const { rad } = rotation;

  if (rad === 0 || width === length) return size;

  const newWidth = Math.round(Math.abs(width * Math.cos(rad)) + Math.abs(length * Math.sin(rad)));
  const newLength = Math.round(Math.abs(width * Math.sin(rad)) + Math.abs(length * Math.cos(rad)));

  return {
    ...size,
    ...{
      width: newWidth,
      length: newLength,
      height: size.height,
    },
  };
}

export function normalizeRotation(angleInDegrees: AngleInDegrees, sectorSizeInDegrees: AngleInDegrees): Angle {
  angleInDegrees = ((angleInDegrees % 360) + 360) % 360;

  const sectorSize = 360 / sectorSizeInDegrees;
  const sectorNumber = Math.floor(angleInDegrees / sectorSize);
  const lowerBoundary = sectorNumber * sectorSize;
  const upperBoundary = (sectorNumber + 1) * sectorSize;
  const lowerBoundaryDifference = Math.abs(angleInDegrees - lowerBoundary);
  const upperBoundaryDifference = Math.abs(upperBoundary - angleInDegrees);

  let normalizedDegree: number;

  if (lowerBoundaryDifference < upperBoundaryDifference) {
    normalizedDegree = lowerBoundary;
  } else {
    normalizedDegree = upperBoundary;
  }

  if (normalizedDegree === 360) {
    normalizedDegree = 0;
  }

  return { deg: normalizedDegree, rad: degToRad(normalizedDegree) };
}
