import { GameMap } from "../../../engine/GameMap";
import { TerrainAreaCoordinates } from "../../../engine/TerrainAreaFactory";

export interface SetTerrainAreaSourcePositionReducerAction {
  type: "setTerrainAreaSourcePosition";
  entityId: string;
  coordinates: TerrainAreaCoordinates;
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
