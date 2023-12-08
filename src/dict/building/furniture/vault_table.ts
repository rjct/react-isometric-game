import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 3;

const vault_table: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_table",
  className: "vault-table",
  size: {
    grid: { width: 1, length: 2, height: 0.7 },
    screen: { width: 113, height: 93 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `furniture/vault/table.webp`),
};

export default vault_table;
