import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type AccelerateVehicleReducerAction = {
  type: "accelerateVehicle";
  vehicle: Vehicle;
  deltaTime: number;
};

export function accelerateVehicle(state: GameMap, action: AccelerateVehicleReducerAction) {
  if (!action.vehicle.accelerationEnabled || action.vehicle.action === "collision") {
    return state;
  }

  const speed = action.vehicle.speed.current + action.deltaTime * 2.5;

  action.vehicle.speed.current = Math.min(action.vehicle.speed.max, speed);

  return { ...state };
}
