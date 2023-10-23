import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm_JHP: AmmoDictEntity = {
  name: "9mm_JHP",
  class: "firearm_ammo",
  type: "9mm",
  title: "9mm JHP",
  description: "Ammunition. Caliber: 9mm, hollow point.",
  speed: 50,
  damage: 60,
  penetration: -20,
  magazineSize: 30,
  weight: 0.042,
  price: 6,
  gfx: {
    icon: {
      size: { width: 108, height: 49 },
      src: "public/assets/ammo/9mm/9mm_JHP/icon.webp",
    },
    isometric: {
      size: { width: 60, height: 9 },
      src: "public/assets/ammo/9mm/9mm_JHP/iso.webp",
    },
  },
};

export default ammo_9mm_JHP;
