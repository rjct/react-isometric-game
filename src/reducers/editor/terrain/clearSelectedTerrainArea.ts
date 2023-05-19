import { GameMap } from "../../../engine/GameMap";
import { TerrainArea } from "../../../engine/TerrainAreaFactory";

export interface ClearSelectedTerrainAreaReducerAction {
  type: "clearSelectedTerrainArea";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedTerrainArea(state: GameMap, action: ClearSelectedTerrainAreaReducerAction): GameMap {
  return { ...state, ...{ selectedTerrainArea: null as unknown as TerrainArea } };
}
