import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 6;

const plant_3: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.plant.CLASS,
  type: "plant_3",
  className: "plant_3",
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 36, height: 36 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.plant.COLOR,
  occupiesCell: false,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `plants/plant_3.webp`),
};

export default plant_3;
