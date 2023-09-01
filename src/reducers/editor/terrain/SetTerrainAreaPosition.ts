import { GameMap } from "@src/engine/GameMap";

export interface SetTerrainAreaPositionReducerAction {
  type: "setTerrainAreaPosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setTerrainAreaPosition(state: GameMap, action: SetTerrainAreaPositionReducerAction): GameMap {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.moveTo(action.coordinates);

    return { ...state };
  }

  return state;
}
