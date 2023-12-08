import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 3;

const plant_2: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.plant.CLASS,
  type: "plant_2",
  className: "plant_2",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 65, height: 70 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.plant.COLOR,
  occupiesCell: false,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `plants/plant_2.webp`),
};

export default plant_2;
