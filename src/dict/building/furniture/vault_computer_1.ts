import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 1;

const vault_computer_1: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_computer_1",
  className: "vault-computer-1",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 74, height: 126 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `furniture/vault/computer-1.webp`),
};

export default vault_computer_1;
