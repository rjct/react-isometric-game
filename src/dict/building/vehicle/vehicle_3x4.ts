import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const vehicle_3x4: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_3x4",
  className: "vehicle_3x4",
  size: {
    grid: { width: 3, length: 4, height: 1 },
    screen: { width: 195, height: 170 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: true,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `vehicles/vehicle_3x4.webp`),
};

export default vehicle_3x4;
