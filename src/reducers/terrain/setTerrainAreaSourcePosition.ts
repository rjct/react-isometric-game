import { GameTerrain } from "@src/context/GameTerrainContext";

export interface SetTerrainAreaSourcePositionReducerAction {
  type: "setTerrainAreaSourcePosition";
  entityId: string;
  coordinates: AreaCoordinates;
}

export function setTerrainAreaSourcePosition(
  state: GameTerrain,
  action: SetTerrainAreaSourcePositionReducerAction,
): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.setSourcePosition(action.coordinates);

    return { ...state };
  }

  return state;
}
