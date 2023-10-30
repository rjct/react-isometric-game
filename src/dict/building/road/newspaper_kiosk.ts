import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const newspaper_kiosk: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "newspaper_kiosk",
  className: "newspaper_kiosk",
  size: {
    grid: { width: 3, length: 2, height: 2 },
    screen: { width: 190, height: 200 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: true,
};

export default newspaper_kiosk;
