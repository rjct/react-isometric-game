import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const trash_bin: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.road.CLASS,
  type: "trash_bin",
  className: "trash_bin",
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 35, height: 46 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.road.COLOR,
  occupiesCell: true,
  blocksRays: false,
  lootable: true,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `road_and_sidewalk/trash_bin.webp`),
};

export default trash_bin;
