import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const traffic_light: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "traffic_light",
  className: "traffic_light",
  size: {
    grid: { width: 1, length: 1, height: 1.6 },
    screen: { width: 52, height: 100 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/traffic_light.webp`),
};

export default traffic_light;
