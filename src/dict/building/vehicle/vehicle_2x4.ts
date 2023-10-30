import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vehicle_2x4: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_2x4",
  className: "vehicle_2x4",
  size: {
    grid: { width: 2, length: 4, height: 0.75 },
    screen: { width: 240, height: 180 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 17,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: true,
};

export default vehicle_2x4;
