import { GameMap } from "@src/engine/gameMap";

export interface SetVehiclePositionReducerAction {
  type: "setVehiclePosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setVehiclePosition(state: GameMap, action: SetVehiclePositionReducerAction): GameMap {
  const entity = state.getVehicleById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], -1);
    entity.setPosition(action.coordinates, state);
    state.setGridMatrixOccupancy([entity], 1);

    return { ...state };
  }

  return state;
}
