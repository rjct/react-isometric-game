import { EffectType } from "@src/context/GameFxContext";
import ammo_45 from "@src/dict/ammo/.45/.45";
import ammo_9mm from "@src/dict/ammo/9mm/_9mm";
import grenade from "@src/dict/ammo/grenade/_grenade";
import melee from "@src/dict/ammo/melee/_melee";

export type WeaponAmmoClass = "firearm_ammo" | "grenade_ammo" | "melee_ammo";

export type WeaponAmmoType =
  | ".303"
  | ".44"
  | ".45"
  | ".50"
  | ".12"
  | "5.56mm"
  | "7.62mm"
  | "9mm"
  //
  | "molotov_cocktail"
  //
  | "punch";

export type WeaponAmmoFxType = "targetReached";
export type WeaponAmmoFx = {
  [type in WeaponAmmoFxType]: EffectType[];
};

export type WeaponAmmoGfxEntity = {
  size: Size2D;
  src: string;
};

export type WeaponAmmoGfx = {
  icon: WeaponAmmoGfxEntity;
  isometric: WeaponAmmoGfxEntity;
};

export type WeaponAmmoSfxType = "targetReached";
export type WeaponAmmoSfx = {
  [type in WeaponAmmoSfxType]?: {
    src: string[];
    timeIntervalMs?: number;
  };
};

export type AmmoDictEntity = {
  class: WeaponAmmoClass;
  type: WeaponAmmoType;
  title: string;
  description: string;
  speed: number;
  // in percent, can be negative(?)
  damage: number;
  // in percent
  penetration: number;
  magazineSize: number;
  weight: number;
  price: number;
  fx?: WeaponAmmoFx;
  gfx?: WeaponAmmoGfx;
  sfx?: WeaponAmmoSfx;
};

const ammoList = { ...ammo_45, ...ammo_9mm, ...grenade, ...melee } as const;

export type AmmoName = keyof typeof ammoList;
export default ammoList;
