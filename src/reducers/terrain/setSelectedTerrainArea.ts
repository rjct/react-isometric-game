import { GameTerrain } from "@src/context/GameTerrainContext";
import { TerrainArea } from "@src/engine/TerrainAreaFactory";

export interface SetSelectedTerrainAreaReducerAction {
  type: "setSelectedTerrainArea";
  entity: TerrainArea;
}

export function setSelectedTerrainArea(state: GameTerrain, action: SetSelectedTerrainAreaReducerAction): GameTerrain {
  return { ...state, ...{ selectedTerrainArea: action.entity } };
}
