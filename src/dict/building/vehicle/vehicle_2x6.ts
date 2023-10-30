import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vehicle_2x6: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_2x6",
  className: "vehicle_2x6",
  size: {
    grid: { width: 2, length: 6, height: 1 },
    screen: { width: 268, height: 205 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: true,
};

export default vehicle_2x6;
