import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm_JHP: AmmoDictEntity = {
  class: "firearm_ammo",
  type: "9mm",
  title: "9mm JHP",
  description: "Ammunition. Caliber: 9mm, hollow point.",
  speed: 20,
  damage: 60,
  penetration: -20,
  magazineSize: 30,
  weight: 0.042,
  price: 6,
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

export default ammo_9mm_JHP;
