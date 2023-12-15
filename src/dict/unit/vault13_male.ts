import { UnitDictEntity } from "@src/dict/unit/_unit";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const unitType = "vault13_male";
const rotationAngles = [0, 90, 180, 270];

const vault13_male: UnitDictEntity = {
  interfaceType: "unit",
  type: unitType,
  className: unitType,
  lootable: true,
  rotationAngles,
  speed: {
    walk: 1,
    run: 2.5,
  },
  coolDownTime: 5,
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 200, height: 200 },
  },
  actionPoints: {
    max: 10,
    consumption: {
      walk: 1,
      run: 2,
      loot: 1,
    },
  },
  rewardXpPoints: 10,
  fieldOfView: {
    sectorAngle: 120,
    range: 20,
  },
  animationDuration: {
    hit: 400,
    notAllowed: 1000,
  },
  sfx: {
    walkStep: {
      src: [
        "/assets/units/vault13_male/walk/step_1.m4a",
        "/assets/units/vault13_male/walk/step_2.m4a",
        "/assets/units/vault13_male/walk/step_3.m4a",
        "/assets/units/vault13_male/walk/step_4.m4a",
      ],
      repeatEveryMs: 1160,
    },
    hit: {
      src: [
        "/assets/units/vault13_male/hit/hit_1.m4a",
        "/assets/units/vault13_male/hit/hit_2.m4a",
        "/assets/units/vault13_male/hit/hit_3.m4a",
        "/assets/units/vault13_male/hit/hit_4.m4a",
        "/assets/units/vault13_male/hit/hit_5.m4a",
      ],
    },
    dead: {
      src: ["/assets/units/vault13_male/dead/dead.m4a"],
    },
  },
  clipPath: generateInitialClipPathObj(
    rotationAngles,
    ["none", "idle", "dead"],
    (variant) => `units/${unitType}/${variant}/${unitType}__${variant}__empty.webp`,
  ),
};

export default {
  vault13_male,
};
