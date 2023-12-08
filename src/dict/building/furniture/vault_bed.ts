import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import { BuildingDictEntity } from "@src/dict/building/_building";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const rotationAngles = [0, 90, 180, 270];
const variants = 2;

const vault_bed: BuildingDictEntity = {
  interfaceType: "building",
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_bed",
  className: "vault-bed",
  size: {
    grid: { width: 2, length: 2, height: 0.5 },
    screen: { width: 150, height: 85 },
  },
  rotationAngles,
  variants,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  lootable: false,
  clipPath: generateInitialClipPathObj(rotationAngles, variants, () => `furniture/vault/bed.webp`),
};

export default vault_bed;
