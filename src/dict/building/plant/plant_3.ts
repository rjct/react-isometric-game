import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const plant_3: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.plant.CLASS,
  type: "plant_3",
  className: "plant_3",
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 36, height: 36 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 6,
  internalColor: BUILDING_DICT_DEFAULTS.plant.COLOR,
  occupiesCell: false,
  blocksRays: false,
  explorable: false,
};

export default plant_3;
