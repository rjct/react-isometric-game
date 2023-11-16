import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type DecelerateVehicleReducerAction = {
  type: "decelerateVehicle";
  vehicle: Vehicle;
  deltaTime: number;
};

export function decelerateVehicle(state: GameMap, action: DecelerateVehicleReducerAction) {
  if (
    action.vehicle.accelerationEnabled ||
    !action.vehicle.driver ||
    action.vehicle.speed.current === 0 ||
    action.vehicle.action === "collision"
  )
    return state;

  const speed = action.vehicle.speed.current - action.deltaTime * 50;

  action.vehicle.speed.current = Math.max(0, speed);

  if (action.vehicle.speed.current === 0) {
    action.vehicle.setAction("idle");
  }

  return { ...state };
}
