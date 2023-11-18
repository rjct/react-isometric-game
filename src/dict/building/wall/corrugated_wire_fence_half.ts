import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const corrugated_wire_fence_half: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.wall.CLASS,
  type: "corrugated_wire_fence_half",
  className: "corrugated_wire_fence_half",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 50, height: 120 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 2,
  internalColor: BUILDING_DICT_DEFAULTS.wall.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: false,
};

export default corrugated_wire_fence_half;
