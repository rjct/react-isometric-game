import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export interface SetSelectedVehicleReducerAction {
  type: "setSelectedVehicle";
  entity: Vehicle;
}

export function setSelectedVehicle(state: GameMap, action: SetSelectedVehicleReducerAction) {
  return { ...state, ...{ selectedVehicle: action.entity } };
}
