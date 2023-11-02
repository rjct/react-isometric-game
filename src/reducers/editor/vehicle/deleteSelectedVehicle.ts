import { GameMap } from "@src/engine/gameMap";

export interface DeleteSelectedVehicleReducerAction {
  type: "deleteSelectedVehicle";
  entityId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteSelectedVehicle(state: GameMap, action: DeleteSelectedVehicleReducerAction): GameMap {
  if (state.deleteSelectedVehicle()) {
    return { ...state };
  }

  return state;
}
