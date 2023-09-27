import { GameTerrain } from "@src/context/GameTerrainContext";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";

export interface ClearSelectedTerrainAreaReducerAction {
  type: "clearSelectedTerrainArea";
}

export function clearSelectedTerrainArea(
  state: GameTerrain,
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  action: ClearSelectedTerrainAreaReducerAction,
): GameTerrain {
  return { ...state, ...{ selectedTerrainArea: null as unknown as TerrainArea } };
}
