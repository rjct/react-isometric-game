import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vault_chair: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_chair",
  className: "vault-chair",
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 66, height: 80 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 2,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: false,
};

export default vault_chair;
