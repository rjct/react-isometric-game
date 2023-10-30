import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const traffic_light: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "traffic_light",
  className: "traffic_light",
  size: {
    grid: { width: 1, length: 1, height: 1.6 },
    screen: { width: 52, height: 100 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  explorable: false,
};

export default traffic_light;
