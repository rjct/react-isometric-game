import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const colt_45: WeaponDictEntity = {
  class: "firearm",
  type: "pistol",
  title: "Colt 45",
  description:
    "The classic Colt M1911 A1. Easy to use, accurate and with tremendous stopping power, this weapon will not let you down.",
  weight: 3,
  price: 350,
  damageType: "normal",
  ammoType: ".45",
  ammoCapacity: 12,
  attackModes: {
    single: {
      actionPointsConsumption: 4,
      ammoConsumption: 1,
      range: 22,
      damage: {
        min: 12,
        max: 18,
      },
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
  },
  sfx: {
    single: {
      src: [
        "public/assets/weapons/firearm/pistol/colt_45/shot_single_1.m4a",
        "public/assets/weapons/firearm/pistol/colt_45/shot_single_2.m4a",
      ],
      timeIntervalMs: 400,
    },
    outOfAmmo: {
      src: ["public/assets/weapons/firearm/pistol/colt_45/out_of_ammo.m4a"],
    },
    reload: {
      src: ["public/assets/weapons/firearm/pistol/colt_45/reload.m4a"],
    },
  },
  gfx: {
    icon: {
      size: { width: 83, height: 54 },
      src: "public/assets/weapons/firearm/pistol/colt_45/icon.webp",
    },
    isometric: {
      size: { width: 76, height: 12 },
      src: "public/assets/weapons/firearm/pistol/colt_45/iso.webp",
    },
  },
  vfx: {
    single: {
      type: ["muzzle-1", "muzzle-2", "muzzle-3"],
      delayBeforeEmitting: 160,
    },
    burst: {
      type: ["muzzle-1", "muzzle-2", "muzzle-3"],
      delayBeforeEmitting: 160,
    },
  },
};

export default colt_45;