import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vehicle_3x2: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_3x2",
  className: "vehicle_3x2",
  size: {
    grid: { width: 3, length: 2, height: 1 },
    screen: { width: 132, height: 93 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: true,
};

export default vehicle_3x2;
