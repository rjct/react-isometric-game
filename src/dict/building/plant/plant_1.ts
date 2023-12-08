import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 2;

const plant_1: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.plant.CLASS,
  type: "plant_1",
  className: "plant_1",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 120, height: 150 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.plant.COLOR,
  occupiesCell: false,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `plants/plant_1.webp`),
};

export default plant_1;
