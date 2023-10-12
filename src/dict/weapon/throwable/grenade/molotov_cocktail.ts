import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const molotov_cocktail: WeaponDictEntity = {
  class: "throwable",
  type: "grenade",
  ammoType: "molotov_cocktail",
  title: "Molotov cocktail",
  description: "A home-made flammable grenade.",
  weight: 1,
  price: 150,
  damageType: "fire",
  attackModes: {
    throw: {
      actionPointsConsumption: 1,
      ammoConsumption: 1,
      range: 18,
      damage: {
        min: 8,
        max: 20,
      },
      removeFromInventoryAfterUse: true,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
  },
  sfx: {},
  gfx: {
    icon: {
      size: { width: 80, height: 48 },
      src: "public/assets/weapons/throwable/grenade/molotov_cocktail/icon.webp",
    },
    isometric: {
      size: { width: 0, height: 0 },
      src: "",
    },
  },
  vfx: {},
};

export default molotov_cocktail;
