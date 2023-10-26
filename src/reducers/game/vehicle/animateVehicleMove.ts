import { GameMap } from "@src/engine/gameMap";
import { degToRad } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type AnimateVehicleMoveReducerAction = {
  type: "animateVehicleMove";
  vehicle: Vehicle;
  deltaTime: number;
};

export function animateVehicleMove(state: GameMap, action: AnimateVehicleMoveReducerAction) {
  const { vehicle, deltaTime } = action;

  let angle = { ...vehicle.realRotation }.deg;

  angle += deltaTime * 20;

  vehicle.setRotation({
    deg: angle,
    rad: degToRad(angle),
  });

  return { ...state };
}
