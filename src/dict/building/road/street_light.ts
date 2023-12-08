import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const street_light: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "street_light",
  className: "street_light",
  size: {
    grid: { width: 1, length: 1, height: 3 },
    screen: { width: 80, height: 145 },
  },
  rotationAngles,
  variants,
  internalColor: "#ffcc33",
  occupiesCell: true,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/street_light.webp`),
};

export default street_light;
