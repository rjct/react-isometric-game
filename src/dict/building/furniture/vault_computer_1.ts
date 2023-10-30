import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vault_computer_1: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_computer_1",
  className: "vault-computer-1",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 74, height: 126 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: false,
};

export default vault_computer_1;
