import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vault_computer_2: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.furniture.CLASS,
  type: "vault_computer_2",
  className: "vault-computer-2",
  size: {
    grid: { width: 1, length: 1, height: 1.7 },
    screen: { width: 94, height: 126 },
  },
  rotationAngles: [90, 270],
  variants: 5,
  internalColor: BUILDING_DICT_DEFAULTS.furniture.COLOR,
  occupiesCell: true,
  blocksRays: true,
  explorable: false,
};

export default vault_computer_2;
