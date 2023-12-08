import corrugated_wire_fence from "@src/dict/building/wall/corrugated_wire_fence";
import corrugated_wire_fence_half from "@src/dict/building/wall/corrugated_wire_fence_half";
import corrugated_wire_fence_half_bottom from "@src/dict/building/wall/corrugated_wire_fence_half_bottom";
import corrugated_wire_fence_half_top from "@src/dict/building/wall/corrugated_wire_fence_half_top";
import vault_wall from "@src/dict/building/wall/vault_wall";
import vault_wall_half_top from "@src/dict/building/wall/vault_wall_half_top";
import { BuildingDictEntity } from "@src/dict/building/_building";

export const wall: { [id: string]: BuildingDictEntity } = {
  vault_wall,
  vault_wall_half_top,
  corrugated_wire_fence,
  corrugated_wire_fence_half,
  corrugated_wire_fence_half_top,
  corrugated_wire_fence_half_bottom,
};

export default wall;
