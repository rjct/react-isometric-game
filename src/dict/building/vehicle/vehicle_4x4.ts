import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vehicle_4x4: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_4x4",
  className: "vehicle_4x4",
  size: {
    grid: { width: 4, length: 4, height: 1.5 },
    screen: { width: 235, height: 176 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: true,
};

export default vehicle_4x4;
