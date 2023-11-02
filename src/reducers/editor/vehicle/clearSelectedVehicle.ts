import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export interface ClearSelectedVehicleReducerAction {
  type: "clearSelectedVehicle";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedVehicle(state: GameMap, action: ClearSelectedVehicleReducerAction): GameMap {
  return { ...state, ...{ selectedVehicle: null as unknown as Vehicle } };
}
