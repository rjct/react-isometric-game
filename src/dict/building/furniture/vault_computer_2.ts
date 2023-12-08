import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [90, 180];
const variants = 5;

const vault_computer_2: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_computer_2",
  className: "vault-computer-2",
  size: {
    grid: { width: 1, length: 1, height: 1.7 },
    screen: { width: 94, height: 126 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `furniture/vault/computer-2.webp`),
};

export default vault_computer_2;
