import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm_AP: AmmoDictEntity = {
  class: "firearm_ammo",
  type: "9mm",
  title: "9mm AP",
  description: "Ammunition. Caliber: 9mm, armor piercing.",
  speed: 50,
  damage: -25,
  penetration: 50,
  magazineSize: 20,
  weight: 0.042,
  price: 4,
  gfx: {
    icon: {
      size: { width: 0, height: 0 },
      src: "",
    },
    isometric: {
      size: { width: 0, height: 0 },
      src: "",
    },
  },
};

export default ammo_9mm_AP;
