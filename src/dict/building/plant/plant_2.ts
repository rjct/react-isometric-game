import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const plant_2: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.plant.CLASS,
  type: "plant_2",
  className: "plant_2",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 65, height: 70 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 3,
  internalColor: BUILDING_DICT_DEFAULTS.plant.COLOR,
  occupiesCell: false,
  blocksRays: false,
  explorable: false,
};

export default plant_2;
