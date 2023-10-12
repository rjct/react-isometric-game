import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const molotov_cocktail: AmmoDictEntity = {
  class: "grenade_ammo",
  type: "molotov_cocktail",
  title: "",
  description: "",
  speed: 6,
  damage: 0,
  penetration: 0,
  magazineSize: 0,
  weight: 0,
  price: 0,
  sfx: {
    targetReached: {
      src: [
        "public/assets/weapons/throwable/grenade/molotov_cocktail/explode_1.m4a",
        "public/assets/weapons/throwable/grenade/molotov_cocktail/explode_2.m4a",
      ],
    },
  },
  vfx: {
    targetReached: {
      type: ["explosion", "fire-explosion"],
      delayBeforeEmitting: 0,
    },
  },
};

export default molotov_cocktail;