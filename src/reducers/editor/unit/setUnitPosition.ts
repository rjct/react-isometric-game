import { GameMap } from "../../../engine/GameMap";

export interface SetUnitPositionReducerAction {
  type: "setUnitPosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setUnitPosition(state: GameMap, action: SetUnitPositionReducerAction): GameMap {
  const entity = state.getUnitById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], state.matrix, -1);
    entity.setPosition(action.coordinates, state);
    state.setGridMatrixOccupancy([entity], state.matrix, 1);

    return { ...state };
  }

  return state;
}
