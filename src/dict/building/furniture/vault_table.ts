import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vault_table: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_table",
  className: "vault-table",
  size: {
    grid: { width: 1, length: 2, height: 0.7 },
    screen: { width: 113, height: 93 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 3,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: false,
};

export default vault_table;
