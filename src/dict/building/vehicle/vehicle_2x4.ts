import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 17;

const vehicle_2x4: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.vehicle.CLASS,
  type: "vehicle_2x4",
  className: "vehicle_2x4",
  size: {
    grid: { width: 2, length: 4, height: 0.75 },
    screen: { width: 240, height: 180 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.vehicle.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: true,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `vehicles/vehicle_2x4.webp`),
};

export default vehicle_2x4;
