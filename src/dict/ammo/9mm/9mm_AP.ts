import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm_AP: AmmoDictEntity = {
  name: "9mm_AP",
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
      size: { width: 114, height: 53 },
      src: "public/assets/ammo/9mm/9mm_AP/icon.webp",
    },
    isometric: {
      size: { width: 60, height: 9 },
      src: "public/assets/ammo/9mm/9mm_AP/iso.webp",
    },
  },
};

export default ammo_9mm_AP;
