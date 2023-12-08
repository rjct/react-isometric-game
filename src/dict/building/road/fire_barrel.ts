import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0];
const variants = 1;

const fire_barrel: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "fire_barrel",
  className: "fire_barrel",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 31, height: 70 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/fire_barrel.webp`),
};

export default fire_barrel;
