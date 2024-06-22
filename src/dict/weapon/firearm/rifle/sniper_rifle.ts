import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const sniper_rifle: WeaponDictEntity = {
  name: "sniper_rifle",
  class: "firearm",
  type: "rifle",
  title: "Sniper rifle",
  description:
    "A DKS-501 Sniper Rifle. Excellent long range projectile weapon. Originally .308, this one is chambered in the more common 7.62 caliber.",
  weight: 10,
  price: 3000,
  damageType: "normal",
  ammoCapacity: 6,
  requiredStat: {
    name: "strength",
    value: 5,
  },
  attackModes: {
    shot_single: {
      skill: "smallGuns",
      ammoType: "7.62mm",
      actionPointsConsumption: 4,
      ammoConsumption: 1,
      range: 50,
      damage: {
        min: 14,
        max: 36,
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
        "/assets/weapons/firearm/rifle/sniper_rifle/shot_single_1.m4a",
        "/assets/weapons/firearm/rifle/sniper_rifle/shot_single_2.m4a",
      ],
      timeIntervalMs: 400,
    },
    outOfAmmo: {
      src: ["/assets/weapons/firearm/rifle/sniper_rifle/out_of_ammo.m4a"],
    },
    reload: {
      src: ["/assets/weapons/firearm/rifle/sniper_rifle/reload.m4a"],
    },
  },
  gfx: {
    icon: {
      size: { width: 128, height: 42 },
      src: "/assets/weapons/firearm/rifle/sniper_rifle/icon.webp",
    },
    isometric: {
      size: { width: 64, height: 21 },
      src: "/assets/weapons/firearm/rifle/sniper_rifle/iso.webp",
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

export default sniper_rifle;
