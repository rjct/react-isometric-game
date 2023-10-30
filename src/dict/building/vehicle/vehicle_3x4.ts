import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vehicle_3x4: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_3x4",
  className: "vehicle_3x4",
  size: {
    grid: { width: 3, length: 4, height: 1 },
    screen: { width: 195, height: 170 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: true,
};

export default vehicle_3x4;
