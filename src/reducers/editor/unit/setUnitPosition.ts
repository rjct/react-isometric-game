import { GameMap } from "@src/engine/gameMap";

export interface SetUnitPositionReducerAction {
  type: "setUnitPosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setUnitPosition(state: GameMap, action: SetUnitPositionReducerAction): GameMap {
  const entity = state.getUnitById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], -1);
    entity.setPosition(action.coordinates, state);
    state.setGridMatrixOccupancy([entity], 1);

    return { ...state };
  }

  return state;
}
