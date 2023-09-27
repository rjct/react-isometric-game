import { GameTerrain } from "@src/context/GameTerrainContext";

export interface SetTerrainAreaVisibilityReducerAction {
  type: "setTerrainAreaVisibility";
  entityId: string;
  visibility: boolean;
}

export function setTerrainAreaVisibility(
  state: GameTerrain,
  action: SetTerrainAreaVisibilityReducerAction,
): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.setVisibility(action.visibility);

    return { ...state };
  }

  return state;
}
