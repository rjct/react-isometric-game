import ammo_45 from "@src/dict/ammo/.45/.45";
import ammo_7_62mm from "@src/dict/ammo/7.62mm/7.62mm";
import ammo_9mm from "@src/dict/ammo/9mm/_9mm";
import microfusion_cell from "@src/dict/ammo/energy/microfusion_cell";
import grenade from "@src/dict/ammo/grenade/_grenade";
import melee from "@src/dict/ammo/melee/_melee";
import { VfxLight, VfxType } from "@src/engine/vfx/VfxFactory";

export enum weaponAmmoClassNames {
  "firearm_ammo" = "Firearm ammo",
  "grenade_ammo" = "Grenade ammo",
  "melee_ammo" = "Melee ammo",
  "laser_ammo" = "Laser ammo",
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
  | "microfusion_cell"
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

const ammoList = { ...ammo_45, ...ammo_9mm, ...ammo_7_62mm, ...microfusion_cell, ...grenade, ...melee };

export type AmmoName = Exclude<keyof typeof ammoList, number>;
export default function getAmmoDictList(skipFakeAmmo = false) {
  if (skipFakeAmmo) {
    return Object.fromEntries(Object.entries(ammoList).filter(([, dictEntity]) => !dictEntity.fakeAmmo));
  }

  return ammoList;
}

export function getAmmoDictEntityByName(ammoName: AmmoName): AmmoDictEntity {
  return getAmmoDictList()[ammoName];
}

export function getAmmoDictEntityByType(ammoType: WeaponAmmoType): AmmoDictEntity[] {
  const ammoList = getAmmoDictList();

  return Object.values(ammoList).filter((ammoDictEntity) => {
    return ammoDictEntity.type === ammoType;
  });
}
