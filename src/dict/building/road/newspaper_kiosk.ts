import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const newspaper_kiosk: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "newspaper_kiosk",
  className: "newspaper_kiosk",
  size: {
    grid: { width: 3, length: 2, height: 2 },
    screen: { width: 190, height: 200 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: true,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/newspaper_kiosk.webp`),
};

export default newspaper_kiosk;
