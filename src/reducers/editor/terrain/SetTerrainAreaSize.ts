import { GameMap } from "../../../engine/GameMap";

export interface SetTerrainAreaSizeReducerAction {
  type: "setTerrainAreaSize";
  entityId: string;
  size: Size2D;
}

export function setTerrainAreaSize(state: GameMap, action: SetTerrainAreaSizeReducerAction): GameMap {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.resizeTo(action.size);

    return { ...state };
  }

  return state;
}
