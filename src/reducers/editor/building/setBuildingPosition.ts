import { GameMap } from "@src/engine/gameMap";

export interface SetBuildingPositionReducerAction {
  type: "setBuildingPosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setBuildingPosition(state: GameMap, action: SetBuildingPositionReducerAction): GameMap {
  const entity = state.getBuildingById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], -1);
    entity.setPosition(action.coordinates, state);
    state.setGridMatrixOccupancy([entity], 1);

    return { ...state };
  }

  return state;
}
