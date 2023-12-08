import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 2;

const vault_chair: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_chair",
  className: "vault-chair",
  size: {
    grid: { width: 1, length: 1, height: 1 },
    screen: { width: 66, height: 80 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `furniture/vault/chair.webp`),
};

export default vault_chair;
