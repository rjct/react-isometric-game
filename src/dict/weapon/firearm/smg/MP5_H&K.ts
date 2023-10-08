import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const mp5: WeaponDictEntity = {
  class: "firearm",
  type: "smg",
  title: "MP5 H&K",
  description: "MP5 H&K. Probably the most widely used and trusted sub-machinegun of the late 20th century.",
  weight: 6,
  price: 1200,
  damageType: "normal",
  ammoType: "9mm",
  ammoCapacity: 15,
  attackModes: {
    single: {
      actionPointsConsumption: 4,
      ammoConsumption: 1,
      range: 25,
      damage: {
        min: 10,
        max: 20,
      },
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
    burst: {
      actionPointsConsumption: 5,
      ammoConsumption: 6,
      range: 20,
      damage: {
        min: 8,
        max: 17,
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
        "public/assets/weapons/firearm/smg/mp5/shot_single_1.m4a",
        "public/assets/weapons/firearm/smg/mp5/shot_single_2.m4a",
      ],
    },
    burst: {
      src: [
        "public/assets/weapons/firearm/smg/mp5/shot_burst_1.m4a",
        "public/assets/weapons/firearm/smg/mp5/shot_burst_2.m4a",
      ],
      timeIntervalMs: 140,
    },
    outOfAmmo: {
      src: ["public/assets/weapons/firearm/smg/mp5/out_of_ammo.m4a"],
    },
    reload: {
      src: ["public/assets/weapons/firearm/smg/mp5/reload.m4a"],
    },
  },
  gfx: {
    icon: {
      size: { width: 57, height: 52 },
      src: "public/assets/weapons/firearm/smg/mp5/icon.webp",
    },
    isometric: {
      size: { width: 72, height: 10 },
      src: "public/assets/weapons/firearm/smg/mp5/iso.webp",
    },
  },
};

export default mp5;
