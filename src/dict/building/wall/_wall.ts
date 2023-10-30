import { BuildingDictEntity } from "@src/dict/building/building";
import corrugated_wire_fence from "@src/dict/building/wall/corrugated_wire_fence";
import corrugated_wire_fence_half from "@src/dict/building/wall/corrugated_wire_fence_half";
import vault_wall from "@src/dict/building/wall/vault_wall";

export const wall: { [id: string]: BuildingDictEntity } = {
  vault_wall,
  corrugated_wire_fence,
  corrugated_wire_fence_half,
};

export default wall;
