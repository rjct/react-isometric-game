import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const phonebox: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "phonebox",
  className: "phonebox",
  size: {
    grid: { width: 1, length: 1, height: 1.6 },
    screen: { width: 52, height: 100 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: true,
};

export default phonebox;
