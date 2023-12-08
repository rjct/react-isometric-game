import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const vehicle_2x6: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_2x6",
  className: "vehicle_2x6",
  size: {
    grid: { width: 2, length: 6, height: 1 },
    screen: { width: 268, height: 205 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: true,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `vehicles/vehicle_2x6.webp`),
};

export default vehicle_2x6;
