import { GameMap } from "../../../engine/GameMap";

export interface SetTerrainAreaSourcePositionReducerAction {
  type: "setTerrainAreaSourcePosition";
  entityId: string;
  coordinates: AreaCoordinates;
}

export function setTerrainAreaSourcePosition(
  state: GameMap,
  action: SetTerrainAreaSourcePositionReducerAction
): GameMap {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.setSourcePosition(action.coordinates);

    return { ...state };
  }

  return state;
}
