import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vault_bed: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_bed",
  className: "vault-bed",
  size: {
    grid: { width: 2, length: 2, height: 0.5 },
    screen: { width: 150, height: 85 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 2,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: false,
};

export default vault_bed;
