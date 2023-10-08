import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const beretta_M92FS: WeaponDictEntity = {
  class: "firearm",
  type: "pistol",
  title: "Beretta M92FS",
  description:
    "One of the more common 9mm pistols, the Beretta is popular due to its reliability, 15 round magazine and good looks.",
  weight: 3,
  price: 250,
  damageType: "normal",
  ammoType: "9mm",
  ammoCapacity: 15,
  attackModes: {
    single: {
      actionPointsConsumption: 4,
      ammoConsumption: 1,
      range: 22,
      damage: {
        min: 8,
        max: 15,
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
        "public/assets/weapons/firearm/pistol/beretta_M92FS/shot_single_1.m4a",
        "public/assets/weapons/firearm/pistol/beretta_M92FS/shot_single_2.m4a",
      ],
      timeIntervalMs: 400,
    },
    outOfAmmo: {
      src: ["public/assets/weapons/firearm/pistol/beretta_M92FS/out_of_ammo.m4a"],
    },
    reload: {
      src: ["public/assets/weapons/firearm/pistol/beretta_M92FS/reload.m4a"],
    },
  },
  gfx: {
    icon: {
      size: { width: 57, height: 52 },
      src: "public/assets/weapons/firearm/pistol/beretta_M92FS/icon.webp",
    },
    isometric: {
      size: { width: 72, height: 10 },
      src: "public/assets/weapons/firearm/pistol/beretta_M92FS/iso.webp",
    },
  },
};

export default beretta_M92FS;
