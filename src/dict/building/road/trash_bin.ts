import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const trash_bin: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "trash_bin",
  className: "trash_bin",
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 35, height: 46 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: true,
};

export default trash_bin;
