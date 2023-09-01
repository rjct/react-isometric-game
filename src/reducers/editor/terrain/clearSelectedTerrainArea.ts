import { GameMap } from "@src/engine/GameMap";
import { TerrainArea } from "@src/engine/TerrainAreaFactory";

export interface ClearSelectedTerrainAreaReducerAction {
  type: "clearSelectedTerrainArea";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedTerrainArea(state: GameMap, action: ClearSelectedTerrainAreaReducerAction): GameMap {
  return { ...state, ...{ selectedTerrainArea: null as unknown as TerrainArea } };
}
