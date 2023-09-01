import { GameMap } from "@src/engine/GameMap";
import { TerrainArea } from "@src/engine/TerrainAreaFactory";

export interface SetSelectedTerrainAreaReducerAction {
  type: "setSelectedTerrainArea";
  entity: TerrainArea;
}

export function setSelectedTerrainArea(state: GameMap, action: SetSelectedTerrainAreaReducerAction) {
  return { ...state, ...{ selectedTerrainArea: action.entity } };
}
