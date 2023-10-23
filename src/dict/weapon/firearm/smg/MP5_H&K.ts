import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const mp5: WeaponDictEntity = {
  name: "mp5",
  class: "firearm",
  type: "smg",
  title: "MP5 H&K",
  description: "MP5 H&K. Probably the most widely used and trusted sub-machinegun of the late 20th century.",
  weight: 6,
  price: 1200,
  damageType: "normal",
  ammoCapacity: 15,
  attackModes: {
    shot_single: {
      ammoType: "9mm",
      actionPointsConsumption: 4,
      ammoConsumption: 1,
      range: 25,
      damage: {
        min: 10,
        max: 20,
      },
      removeFromInventoryAfterUse: false,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
    shot_burst: {
      ammoType: "9mm",
      actionPointsConsumption: 5,
      ammoConsumption: 6,
      range: 20,
      damage: {
        min: 8,
        max: 17,
      },
      removeFromInventoryAfterUse: false,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
  },
  sfx: {
    shot_single: {
      src: [
        "public/assets/weapons/firearm/smg/mp5/shot_single_1.m4a",
        "public/assets/weapons/firearm/smg/mp5/shot_single_2.m4a",
      ],
      timeIntervalMs: 160,
    },
    shot_burst: {
      src: [
        "public/assets/weapons/firearm/smg/mp5/shot_burst_1.m4a",
        "public/assets/weapons/firearm/smg/mp5/shot_burst_2.m4a",
      ],
      timeIntervalMs: 160,
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
  vfx: {
    shot_single: {
      type: ["muzzle-1", "muzzle-2", "muzzle-3"],
      animationDuration: 100,
      delayBeforeEmitting: 500,
      light: {
        animationDuration: 50,
        color: "#ffff00",
        radius: 3,
      },
    },
    shot_burst: {
      type: ["muzzle-1", "muzzle-2", "muzzle-3"],
      animationDuration: 100,
      delayBeforeEmitting: 160,
    },
  },
};

export default mp5;
