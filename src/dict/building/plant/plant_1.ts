import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const plant_1: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.plant.CLASS,
  type: "plant_1",
  className: "plant_1",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 120, height: 150 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 2,
  internalColor: BUILDING_DICT_DEFAULTS.plant.COLOR,
  occupiesCell: false,
  blocksRays: false,
  explorable: false,
};

export default plant_1;
