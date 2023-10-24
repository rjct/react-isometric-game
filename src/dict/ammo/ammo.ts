import ammo_45 from "@src/dict/ammo/.45/.45";
import ammo_9mm from "@src/dict/ammo/9mm/_9mm";
import grenade from "@src/dict/ammo/grenade/_grenade";
import melee from "@src/dict/ammo/melee/_melee";
import { VfxLight, VfxType } from "@src/engine/vfx/VfxFactory";

export enum weaponAmmoClassNames {
  "firearm_ammo" = "Firearm ammo",
  "grenade_ammo" = "",
  "melee_ammo" = "",
}
export type WeaponAmmoClass = keyof typeof weaponAmmoClassNames;

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
  | "frag_grenade"
  //
  | "punch"
  | "throwing_knife";

export type WeaponAmmoVFxType = "targetReached";
export type WeaponAmmoVfx = {
  [type in WeaponAmmoVFxType]: {
    type: Array<VfxType>;
    animationDuration: number;
    delayBeforeEmitting: number;
    light?: VfxLight;
  };
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
  name: AmmoName;
  fakeAmmo?: boolean;
  class: WeaponAmmoClass;
  type: WeaponAmmoType;
  title: string;
  description: string;
  speed: number;
  // in percent
  damage: number;
  // in percent
  penetration: number;
  magazineSize: number;
  weight: number;
  price: number;
  gfx?: WeaponAmmoGfx;
  sfx?: WeaponAmmoSfx;
  vfx?: WeaponAmmoVfx;
};

const ammoList = { ...ammo_45, ...ammo_9mm, ...grenade, ...melee };

export type AmmoName = Exclude<keyof typeof ammoList, number>;
export default function getAmmoDictList(skipFakeAmmo = false) {
  if (skipFakeAmmo) {
    return Object.fromEntries(Object.entries(ammoList).filter(([, dictEntity]) => !dictEntity.fakeAmmo));
  }

  return ammoList;
}
