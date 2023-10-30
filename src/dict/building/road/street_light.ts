import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const street_light: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "street_light",
  className: "street_light",
  size: {
    grid: { width: 1, length: 1, height: 3 },
    screen: { width: 80, height: 145 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: "#ffcc33",
  occupiesCell: true,
  blocksRays: false,
  explorable: false,
};

export default street_light;
