import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const corrugated_wire_fence_half_bottom: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.wall.CLASS,
  type: "corrugated_wire_fence_half_bottom",
  className: "corrugated_wire_fence_half_bottom",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 50, height: 120 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 3,
  internalColor: BUILDING_DICT_DEFAULTS.wall.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: false,
};

export default corrugated_wire_fence_half_bottom;
