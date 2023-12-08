import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 270];
const variants = 1;

const highway_fence_broken: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "highway_fence_broken",
  className: "highway_fence_broken",
  size: {
    grid: { width: 1, length: 2, height: 0.7 },
    screen: { width: 104, height: 76 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/highway_fence_broken.webp`),
};

export default highway_fence_broken;
