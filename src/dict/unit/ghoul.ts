import { UnitDictEntity } from "@src/dict/unit/_unit";

const ghoul: UnitDictEntity = {
  type: "ghoul",
  className: "ghoul",
  explorable: true,
  speed: {
    walk: 0.4,
    run: 0.8,
  },
  coolDownTime: 5,
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 200, height: 200 },
  },
  healthPoints: {
    current: 100,
    max: 100,
  },
  actionPoints: {
    max: 10,
    consumption: {
      walk: 1,
      run: 2,
      explore: 1,
    },
  },
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
        "public/assets/units/vault13_male/walk/step_1.m4a",
        "public/assets/units/vault13_male/walk/step_2.m4a",
        "public/assets/units/vault13_male/walk/step_3.m4a",
        "public/assets/units/vault13_male/walk/step_4.m4a",
      ],
      repeatEveryMs: 950,
    },
    hit: {
      src: [
        "public/assets/units/ghoul/hit/hit_1.m4a",
        "public/assets/units/ghoul/hit/hit_2.m4a",
        "public/assets/units/ghoul/hit/hit_3.m4a",
        "public/assets/units/ghoul/hit/hit_4.m4a",
        "public/assets/units/ghoul/hit/hit_5.m4a",
      ],
    },
    dead: {
      src: [
        "public/assets/units/ghoul/dead/dead_1.m4a",
        "public/assets/units/ghoul/dead/dead_2.m4a",
        "public/assets/units/ghoul/dead/dead_3.m4a",
      ],
    },
  },
};

export default {
  ghoul,
};
