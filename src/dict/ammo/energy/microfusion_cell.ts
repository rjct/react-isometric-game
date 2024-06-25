import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_microfusion_cell: { [id: string]: AmmoDictEntity } = {
  microfusion_cell: {
    name: "microfusion_cell",
    class: "laser_ammo",
    type: "microfusion_cell",
    title: "Microfusion cell",
    description: "A medium sized energy production unit. Self-contained fusion plant.",
    speed: 50,
    damage: 0,
    penetration: 0,
    magazineSize: 50,
    weight: 5,
    price: 4,
    gfx: {
      icon: {
        size: { width: 36, height: 51 },
        src: "/assets/ammo/energy/microfusion_cell/icon.webp",
      },
      isometric: {
        size: { width: 29, height: 26 },
        src: "/assets/ammo/energy/microfusion_cell/iso.webp",
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
        delayBeforeEmitting: 50,
        animationDuration: 200,
      },
    },
  },
};

export default ammo_microfusion_cell;
