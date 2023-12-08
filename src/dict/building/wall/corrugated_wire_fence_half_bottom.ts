import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 3;

const corrugated_wire_fence_half_bottom: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.wall.CLASS,
  type: "corrugated_wire_fence_half_bottom",
  className: "corrugated_wire_fence_half_bottom",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 72, height: 130 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.wall.COLOR,
  occupiesCell: true,
  blocksRays: false,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `walls/corrugated_wire_fence_half_bottom.webp`),
};

export default corrugated_wire_fence_half_bottom;
