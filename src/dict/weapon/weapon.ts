import { WeaponAmmoType } from "@src/dict/ammo/ammo";
import firearm from "@src/dict/weapon/firearm/firearm";
import melee from "@src/dict/weapon/melee/melee";
import throwable from "@src/dict/weapon/throwable/throwable";
import throwable_melee from "@src/dict/weapon/throwableMelee/throwableMelee";
import { UnitPrimaryStatName, UnitSkillName } from "@src/engine/unit/UnitCharacteristicsFactory";
import { VfxLight, VfxType } from "@src/engine/vfx/VfxFactory";

export enum weaponClassNames {
  "melee" = "Melee",
  "firearm" = "Firearm",
  "throwable" = "Throwable",
}

export type WeaponClass = keyof typeof weaponClassNames;
export type WeaponType = "pistol" | "smg" | "grenade" | "knife";
export type WeaponDamage = {
  min: number;
  max: number;
};
export type WeaponDamageType = "normal" | "explosion" | "fire";
export type WeaponAttackMode = "punch" | "shot_single" | "shot_burst" | "throw";

export type WeaponSfxType = WeaponAttackMode | "outOfAmmo" | "reload";
export type WeaponSfx = {
  [type in WeaponSfxType]?: {
    src: string[];
    timeIntervalMs?: number;
  };
};

export type WeaponGfxIcon = {
  size: Size2D;
  src: string;
};

export type WeaponGfx = {
  icon: WeaponGfxIcon;
  isometric: WeaponGfxIcon;
};

export type WeaponVfx = {
  [type in WeaponAttackMode]?: {
    type: Array<VfxType>;
    animationDuration: number;
    delayBeforeEmitting: number;
    delayBetweenEmitting?: number;
    light?: VfxLight;
  };
};

export type WeaponDictEntityAttackMode = {
  ammoType: WeaponAmmoType;
  actionPointsConsumption: number;
  ammoConsumption: number;
  range: number;
  damage: WeaponDamage;
  skill: UnitSkillName;
  removeFromInventoryAfterUse: boolean;
  animationDuration: {
    attack: number;
    attackCompleted: number;
    attackNotAllowed: number;
  };
};

export type WeaponDictEntity = {
  name: WeaponName;
  class: WeaponClass;
  type: WeaponType;
  title: string;
  description: string;
  weight: number;
  price: number;
  requiredStat: {
    name: UnitPrimaryStatName;
    value: number;
  };
  damageType: WeaponDamageType;
  ammoCapacity?: number;
  attackModes: {
    [attackMode in WeaponAttackMode]?: WeaponDictEntityAttackMode;
  };
  sfx: WeaponSfx;
  gfx: WeaponGfx;
  vfx: WeaponVfx;
};

const weaponList = { ...melee, ...firearm, ...throwable, ...throwable_melee };

export type WeaponName = Exclude<keyof typeof weaponList, number>;

export default function getWeaponDictList() {
  return weaponList;
}
