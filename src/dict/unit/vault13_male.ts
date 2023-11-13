import { UnitDictEntity } from "@src/dict/unit/_unit";

const vault13_male: UnitDictEntity = {
  type: "vault13_male",
  className: "vault13_male",
  explorable: true,
  speed: {
    walk: 1,
    run: 2.5,
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
        "public/assets/units/vault13_male/walk/step_1.m4a",
        "public/assets/units/vault13_male/walk/step_2.m4a",
        "public/assets/units/vault13_male/walk/step_3.m4a",
        "public/assets/units/vault13_male/walk/step_4.m4a",
      ],
      repeatEveryMs: 1160,
    },
    hit: {
      src: [
        "public/assets/units/vault13_male/hit/hit_1.m4a",
        "public/assets/units/vault13_male/hit/hit_2.m4a",
        "public/assets/units/vault13_male/hit/hit_3.m4a",
        "public/assets/units/vault13_male/hit/hit_4.m4a",
        "public/assets/units/vault13_male/hit/hit_5.m4a",
      ],
    },
    dead: {
      src: ["public/assets/units/vault13_male/dead/dead.m4a"],
    },
  },
};

export default {
  vault13_male,
};
