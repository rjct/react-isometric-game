import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const laser_rifle: WeaponDictEntity = {
  name: "laser_rifle",
  class: "firearm",
  type: "rifle",
  title: "Laser rifle",
  description:
    "A Wattz 2000 laser rifle. Uses micro fusion cells for more powerful lasers, and an extended barrel for additional range.",
  weight: 12,
  price: 6000,
  damageType: "energy",
  ammoCapacity: 12,
  requiredStat: {
    name: "strength",
    value: 5,
  },
  attackModes: {
    shot_single: {
      skill: "smallGuns",
      ammoType: "microfusion_cell",
      actionPointsConsumption: 5,
      ammoConsumption: 1,
      range: 45,
      damage: {
        min: 23,
        max: 50,
      },
      removeFromInventoryAfterUse: false,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
    shot_burst: {
      skill: "smallGuns",
      ammoType: "microfusion_cell",
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
        "/assets/weapons/firearm/rifle/laser_rifle/shot_single_1.m4a",
        "/assets/weapons/firearm/rifle/laser_rifle/shot_single_2.m4a",
      ],
      timeIntervalMs: 400,
    },
    outOfAmmo: {
      src: ["/assets/weapons/firearm/rifle/laser_rifle/out_of_ammo.m4a"],
    },
    reload: {
      src: ["/assets/weapons/firearm/rifle/laser_rifle/reload.m4a"],
    },
  },
  gfx: {
    icon: {
      size: { width: 128, height: 36 },
      src: "/assets/weapons/firearm/rifle/laser_rifle/icon.webp",
    },
    isometric: {
      size: { width: 64, height: 21 },
      src: "/assets/weapons/firearm/rifle/laser_rifle/iso.webp",
    },
  },
  vfx: {
    shot_single: {
      type: ["muzzle-1", "muzzle-2", "muzzle-3"],
      animationDuration: 100,
      delayBetweenEmitting: 50,
      delayBeforeEmitting: 500,
      light: {
        animationDuration: 50,
        color: "#ff0000",
        radius: 2,
      },
    },
  },
};

export default laser_rifle;
