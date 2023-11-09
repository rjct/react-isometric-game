import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const throwing_knife: WeaponDictEntity = {
  name: "throwing_knife",
  class: "throwable",
  type: "knife",
  title: "Throwing knife",
  description: "A knife, balanced specifically for throwing. Made of titanium, and laser sharpened.",
  weight: 1,
  price: 100,
  damageType: "normal",
  requiredStat: {
    name: "strength",
    value: 1,
  },
  attackModes: {
    punch: {
      skill: "meleeWeapons",
      ammoType: "punch",
      actionPointsConsumption: 3,
      ammoConsumption: 1,
      range: 1,
      damage: {
        min: 3,
        max: 6,
      },
      removeFromInventoryAfterUse: false,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
    throw: {
      skill: "throwing",
      ammoType: "throwing_knife",
      actionPointsConsumption: 3,
      ammoConsumption: 1,
      range: 16,
      damage: {
        min: 3,
        max: 6,
      },
      removeFromInventoryAfterUse: true,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
  },
  sfx: {
    punch: {
      src: [
        "public/assets/weapons/throwable_melee/knife/throwing_knife/punch_1.m4a",
        "public/assets/weapons/throwable_melee/knife/throwing_knife/punch_2.m4a",
        "public/assets/weapons/throwable_melee/knife/throwing_knife/punch_3.m4a",
      ],
    },
    throw: {
      src: [
        "public/assets/weapons/throwable_melee/knife/throwing_knife/throw_1.m4a",
        "public/assets/weapons/throwable_melee/knife/throwing_knife/throw_2.m4a",
        "public/assets/weapons/throwable_melee/knife/throwing_knife/throw_3.m4a",
      ],
    },
  },
  gfx: {
    icon: {
      size: { width: 122, height: 30 },
      src: "public/assets/weapons/throwable_melee/knife/throwing_knife/icon.webp",
    },
    isometric: {
      size: { width: 0, height: 0 },
      src: "",
    },
  },
  vfx: {},
};

export default throwing_knife;
