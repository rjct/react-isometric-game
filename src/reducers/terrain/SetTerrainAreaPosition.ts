import { GameTerrain } from "@src/context/GameTerrainContext";

export interface SetTerrainAreaPositionReducerAction {
  type: "setTerrainAreaPosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setTerrainAreaPosition(state: GameTerrain, action: SetTerrainAreaPositionReducerAction): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.moveTo(action.coordinates);

    return { ...state };
  }

  return state;
}
