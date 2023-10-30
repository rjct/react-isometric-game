import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const highway_fence_end: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "highway_fence_end",
  className: "highway_fence_end",
  size: {
    grid: { width: 1, length: 1, height: 0.7 },
    screen: { width: 70, height: 60 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: false,
};

export default highway_fence_end;
