import { UnitDictEntity } from "@src/dict/unit/_unit";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const unitType = "ghoul";

const rotationAngles = [0, 90, 180, 270];

const ghoul: UnitDictEntity = {
  interfaceType: "unit",
  type: unitType,
  className: unitType,
  lootable: true,
  rotationAngles,
  speed: {
    walk: 0.4,
    run: 0.8,
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
    sectorAngle: 30,
    range: 6,
  },
  animationDuration: {
    hit: 400,
    notAllowed: 1000,
  },
  sfx: {
    walkStep: {
      src: [
        "/assets/vehicles/drivable/public/assets/units/vault13_male/walk/step_1.m4a",
        "/assets/units/vault13_male/walk/step_2.m4a",
        "/assets/units/vault13_male/walk/step_3.m4a",
        "/assets/units/vault13_male/walk/step_4.m4a",
      ],
      repeatEveryMs: 950,
    },
    hit: {
      src: [
        "/assets/units/ghoul/hit/hit_1.m4a",
        "/assets/units/ghoul/hit/hit_2.m4a",
        "/assets/units/ghoul/hit/hit_3.m4a",
        "/assets/units/ghoul/hit/hit_4.m4a",
        "/assets/units/ghoul/hit/hit_5.m4a",
      ],
    },
    dead: {
      src: [
        "/assets/units/ghoul/dead/dead_1.m4a",
        "/assets/units/ghoul/dead/dead_2.m4a",
        "/assets/units/ghoul/dead/dead_3.m4a",
      ],
    },
  },
  clipPath: generateInitialClipPathObj(
    rotationAngles,
    ["none", "idle", "dead"],
    (variant) => `units/${unitType}/${variant}/${unitType}__${variant}__empty.webp`,
  ),
};

export default {
  ghoul,
};
