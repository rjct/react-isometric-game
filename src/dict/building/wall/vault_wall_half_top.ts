import { BuildingDictEntity } from "@src/dict/building/building";
import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";

const vault_wall_half_top: BuildingDictEntity = {
  class: BUILDING_DICT_DEFAULTS.wall.CLASS,
  type: "vault_wall_half_top",
  className: "vault-wall-half-top",
  size: {
    grid: { width: 1, length: 1, height: 2 },
    screen: { width: 50, height: 120 },
  },
  rotationAngles: [0, 90, 180, 270],
  variants: 1,
  internalColor: BUILDING_DICT_DEFAULTS.wall.COLOR,
  occupiesCell: false,
  blocksRays: false,
  explorable: false,
};

export default vault_wall_half_top;
