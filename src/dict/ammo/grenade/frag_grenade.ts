import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const frag_grenade: AmmoDictEntity = {
  class: "grenade_ammo",
  type: "frag_grenade",
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
        "public/assets/weapons/throwable/grenade/grenade_explode_1.m4a",
        "public/assets/weapons/throwable/grenade/grenade_explode_2.m4a",
      ],
    },
  },
  vfx: {
    targetReached: {
      type: ["explosion"],
      delayBeforeEmitting: 0,
      animationDuration: 600,
      light: {
        animationDuration: 100,
        color: "#ffc400",
        radius: 15,
      },
    },
  },
};

export default frag_grenade;
