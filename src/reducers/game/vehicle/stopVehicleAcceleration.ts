import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type StopVehicleAccelerationReducerAction = {
  type: "stopVehicleAcceleration";
  vehicle: Vehicle;
};

export function stopVehicleAcceleration(state: GameMap, action: StopVehicleAccelerationReducerAction) {
  const { vehicle } = action;

  if (!vehicle.accelerationEnabled) {
    return state;
  }

  action.vehicle.accelerationEnabled = false;

  const shiftOutSfx = state.createSfx([vehicle.dictEntity.sfx["shiftOut"].src], 1);
  const idleSfx = state.createSfx([vehicle.dictEntity.sfx["idle"].src], 1);

  if (shiftOutSfx) {
    const stopTime = 600;

    vehicle.currentPlayingSfx["driving"]?.stop();
    vehicle.currentPlayingSfx["driving"]?.disconnect();
    delete vehicle.currentPlayingSfx["driving"];

    if (idleSfx) {
      window.setTimeout(() => {
        if (vehicle.currentPlayingSfx["idle"]) {
          vehicle.currentPlayingSfx["idle"].stop();
          vehicle.currentPlayingSfx["idle"].disconnect();
        }

        vehicle.currentPlayingSfx["idle"] = idleSfx;

        idleSfx.loop = true;
        idleSfx.start();
      }, stopTime);
    }

    shiftOutSfx.start();
  }

  return { ...state };
}
