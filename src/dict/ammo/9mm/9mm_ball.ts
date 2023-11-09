import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm_ball: AmmoDictEntity = {
  name: "9mm_ball",
  class: "firearm_ammo",
  type: "9mm",
  title: "9mm ball",
  description:
    "A collection of ancient 9mm rounds. Heavy grease to preserve them from the environment. Standard bullets",
  speed: 20,
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
  sfx: {
    targetReached: {
      src: [
        "public/assets/weapons/firearm/rico_1.mp3",
        "public/assets/weapons/firearm/rico_2.mp3",
        "public/assets/weapons/firearm/rico_3.mp3",
        "public/assets/weapons/firearm/rico_4.mp3",
        "public/assets/weapons/firearm/rico_5.mp3",
        "public/assets/weapons/firearm/rico_6.mp3",
        "public/assets/weapons/firearm/rico_7.mp3",
      ],
    },
  },
  vfx: {
    targetReached: {
      type: ["hit-ground"],
      delayBeforeEmitting: 0,
      animationDuration: 200,
    },
  },
};

export default ammo_9mm_ball;
