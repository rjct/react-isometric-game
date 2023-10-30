import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const fire_barrel: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "fire_barrel",
  className: "fire_barrel",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 31, height: 70 },
  },
  rotationAngles: [0],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: false,
};

export default fire_barrel;
