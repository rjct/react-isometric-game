import { WeaponDictEntity } from "@src/dict/weapon/weapon";

const frag_grenade: WeaponDictEntity = {
  name: "frag_grenade",
  class: "throwable",
  type: "grenade",
  title: "Frag grenade",
  description:
    "A generic fragmentation grenade. Contains a small amount of high explosives, the container itself forming most of the damaging fragments. Explodes on contact.",
  weight: 1,
  price: 400,
  damageType: "normal",
  requiredStat: {
    name: "strength",
    value: 4,
  },
  attackModes: {
    throw: {
      skill: "throwing",
      ammoType: "frag_grenade",
      actionPointsConsumption: 6,
      ammoConsumption: 1,
      range: 15,
      blastRadius: 5,
      damage: {
        min: 30,
        max: 50,
      },
      removeFromInventoryAfterUse: true,
      animationDuration: {
        attack: 400,
        attackCompleted: 1000,
        attackNotAllowed: 1000,
      },
    },
  },
  sfx: {},
  gfx: {
    icon: {
      size: { width: 58, height: 49 },
      src: "/assets/weapons/throwable/grenade/frag_grenade/icon.webp",
    },
    isometric: {
      size: { width: 0, height: 0 },
      src: "",
    },
  },
  vfx: {},
};

export default frag_grenade;
