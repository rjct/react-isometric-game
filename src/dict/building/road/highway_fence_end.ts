import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const highway_fence_end: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "highway_fence_end",
  className: "highway_fence_end",
  size: {
    grid: { width: 1, length: 1, height: 0.7 },
    screen: { width: 70, height: 60 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/highway_fence_end.webp`),
};

export default highway_fence_end;
