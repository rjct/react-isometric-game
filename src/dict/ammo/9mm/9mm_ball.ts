import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm_ball: AmmoDictEntity = {
  class: "firearm_ammo",
  type: "9mm",
  title: "9mm ball",
  description:
    "A collection of ancient 9mm rounds. Heavy grease to preserve them from the environment. Standard bullets",
  speed: 50,
  damage: -11,
  penetration: -20,
  magazineSize: 10,
  weight: 0.042,
  price: 2,
  gfx: {
    icon: {
      size: { width: 116, height: 54 },
      src: "public/assets/ammo/9mm/9mm_ball/icon.webp",
    },
    isometric: {
      size: { width: 60, height: 9 },
      src: "public/assets/ammo/9mm/9mm_ball/iso.webp",
    },
  },
};

export default ammo_9mm_ball;
