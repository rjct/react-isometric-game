import { GameMap } from "../../../engine/GameMap";
import { TerrainArea } from "../../../engine/TerrainAreaFactory";

export interface SetSelectedTerrainAreaReducerAction {
  type: "setSelectedTerrainArea";
  entity: TerrainArea;
}

export function setSelectedTerrainArea(state: GameMap, action: SetSelectedTerrainAreaReducerAction) {
  return { ...state, ...{ selectedTerrainArea: action.entity } };
}
