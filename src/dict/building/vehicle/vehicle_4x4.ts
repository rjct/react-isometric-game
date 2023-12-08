import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const vehicle_4x4: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_4x4",
  className: "vehicle_4x4",
  size: {
    grid: { width: 4, length: 4, height: 1.5 },
    screen: { width: 235, height: 176 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: true,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `vehicles/vehicle_4x4.webp`),
};

export default vehicle_4x4;
