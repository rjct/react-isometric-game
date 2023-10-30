import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const highway_fence: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "highway_fence",
  className: "highway_fence",
  size: {
    grid: { width: 1, length: 2, height: 0.7 },
    screen: { width: 104, height: 76 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 2,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: false,
};

export default highway_fence;
