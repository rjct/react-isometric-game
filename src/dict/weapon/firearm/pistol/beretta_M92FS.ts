import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const beretta_M92FS: WeaponDictEntity = {
  name: "beretta_M92FS",
  class: "firearm",
  type: "pistol",
  title: "Beretta M92FS",
  description:
    "One of the more common 9mm pistols, the Beretta is popular due to its reliability, 15 round magazine and good looks.",
  weight: 3,
  price: 250,
  damageType: "normal",
  ammoCapacity: 15,
  requiredStat: {
    name: "strength",
    value: 3,
  },
  attackModes: {
    shot_single: {
      skill: "smallGuns",
      ammoType: "9mm",
      actionPointsConsumption: 4,
      ammoConsumption: 1,
      range: 22,
      damage: {
        min: 8,
        max: 15,
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
        "/assets/weapons/firearm/pistol/beretta_M92FS/shot_single_1.m4a",
        "/assets/weapons/firearm/pistol/beretta_M92FS/shot_single_2.m4a",
      ],
      timeIntervalMs: 400,
    },
    outOfAmmo: {
      src: ["/assets/weapons/firearm/pistol/beretta_M92FS/out_of_ammo.m4a"],
    },
    reload: {
      src: ["/assets/weapons/firearm/pistol/beretta_M92FS/reload.m4a"],
    },
  },
  gfx: {
    icon: {
      size: { width: 57, height: 52 },
      src: "/assets/weapons/firearm/pistol/beretta_M92FS/icon.webp",
    },
    isometric: {
      size: { width: 72, height: 10 },
      src: "/assets/weapons/firearm/pistol/beretta_M92FS/iso.webp",
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
        radius: 5,
      },
    },
  },
};

export default beretta_M92FS;
