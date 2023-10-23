import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const punch: AmmoDictEntity = {
  name: "punch",
  fakeAmmo: true,
  class: "melee_ammo",
  type: "punch",
  title: "",
  description: "",
  speed: 1000,
  damage: 0,
  penetration: 0,
  magazineSize: 0,
  weight: 0,
  price: 0,
  sfx: {
    targetReached: {
      src: [],
    },
  },
};

export default punch;
