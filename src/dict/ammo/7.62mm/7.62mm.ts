import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_7_62mm: { [id: string]: AmmoDictEntity } = {
  "7_62mm": {
    name: "7_62mm",
    class: "firearm_ammo",
    type: "7.62mm",
    title: "7.62mm",
    description: "Ammunition. Caliber: 7.62mm.",
    speed: 50,
    damage: 0,
    penetration: 0,
    magazineSize: 50,
    weight: 0.03,
    price: 4,
    gfx: {
      icon: {
        size: { width: 57, height: 52 },
        src: "/assets/ammo/7_62mm/icon.webp",
      },
      isometric: {
        size: { width: 29, height: 26 },
        src: "/assets/ammo/7_62mm/iso.webp",
      },
    },
    sfx: {
      targetReached: {
        src: [
          "/assets/weapons/firearm/rico_1.mp3",
          "/assets/weapons/firearm/rico_2.mp3",
          "/assets/weapons/firearm/rico_3.mp3",
          "/assets/weapons/firearm/rico_4.mp3",
          "/assets/weapons/firearm/rico_5.mp3",
          "/assets/weapons/firearm/rico_6.mp3",
          "/assets/weapons/firearm/rico_7.mp3",
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
  },
};

export default ammo_7_62mm;
