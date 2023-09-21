import { GameTerrain } from "@src/context/GameTerrainContext";

export interface SetTerrainAreaSizeReducerAction {
  type: "setTerrainAreaSize";
  entityId: string;
  size: Size2D;
}

export function setTerrainAreaSize(state: GameTerrain, action: SetTerrainAreaSizeReducerAction): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.resizeTo(action.size);

    return { ...state };
  }

  return state;
}
