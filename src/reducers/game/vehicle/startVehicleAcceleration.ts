import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { calcMovementPath } from "@src/engine/vehicle/_helpers";

export type StartVehicleAccelerationReducerAction = {
  type: "startVehicleAcceleration";
  vehicle: Vehicle;
  targetPosition: GridCoordinates;
};

export function startVehicleAcceleration(state: GameMap, action: StartVehicleAccelerationReducerAction) {
  const { vehicle, targetPosition } = action;

  if (vehicle.accelerationEnabled) {
    return state;
  }

  vehicle.accelerationEnabled = true;
  vehicle.setAction("driving");

  const movement = calcMovementPath(vehicle, targetPosition);

  vehicle.setPath(movement.path);
  vehicle.setGearShiftMode(movement.gearShiftMode);

  //
  const shiftInSfx = state.createSfx([vehicle.dictEntity.sfx["shiftIn"].src], 1);
  const drivingInSfx = state.createSfx([vehicle.dictEntity.sfx["driving"].src], 1);

  if (shiftInSfx) {
    if (vehicle.currentPlayingSfx["driving"]) {
      vehicle.currentPlayingSfx["driving"]?.stop();
      vehicle.currentPlayingSfx["driving"]?.disconnect();
    }

    window.setTimeout(() => {
      vehicle.currentPlayingSfx["idle"]?.stop();
      vehicle.currentPlayingSfx["idle"]?.disconnect();
      delete vehicle.currentPlayingSfx["idle"];
    }, 750);

    const stopTime = 600;

    if (drivingInSfx) {
      window.setTimeout(() => {
        vehicle.currentPlayingSfx["driving"] = drivingInSfx;

        drivingInSfx.loop = true;
        drivingInSfx.start();
      }, stopTime);
    }

    shiftInSfx.start();
  }

  return { ...state };
}
