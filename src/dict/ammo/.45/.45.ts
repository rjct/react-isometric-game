import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_45: { [id: string]: AmmoDictEntity } = {
  ".45": {
    class: "firearm_ammo",
    type: ".45",
    title: ".45 caliber",
    description:
      "The .45 Auto is an effective pistol cartridge for use against soft, unarmored targets. It combines accuracy and good stopping power, with low visibility and moderate recoil.",
    speed: 50,
    damage: 0,
    penetration: 0,
    magazineSize: 20,
    weight: 0.1,
    price: 5,
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
  },
};

export default ammo_45;
