import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const broken_bottle: WeaponDictEntity = {
  name: "broken_bottle",
  class: "melee",
  type: "knife",
  title: "Broken bottle",
  description: "The preferred weapon for advocates of the drunken brawl.",
  weight: 1,
  price: 25,
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
      ammoConsumption: 0,
      range: 1,
      damage: {
        min: 1,
        max: 5,
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
    punch: {
      src: [],
    },
  },
  gfx: {
    icon: {
      size: { width: 123, height: 42 },
      src: "/assets/weapons/melee/broken_bottle/icon.webp",
    },
    isometric: {
      size: { width: 47, height: 8 },
      src: "/assets/weapons/melee/broken_bottle/iso.webp",
    },
  },
  vfx: {},
};

export default broken_bottle;
