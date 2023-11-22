import { VehicleSfxType } from "@src/dict/vehicle/_vehicle";
import { GameMap } from "@src/engine/gameMap";
import { degToRad } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type HandleVehicleCollisionReducerAction = {
  type: "handleVehicleCollision";
  vehicle: Vehicle;
};

export function handleVehicleCollision(state: GameMap, action: HandleVehicleCollisionReducerAction) {
  const { vehicle } = action;

  const newAngle = vehicle.rotation.deg + 11.25;

  vehicle.driver!.setRotation({ rad: degToRad(newAngle), deg: newAngle }, false);

  Object.entries(vehicle.currentPlayingSfx).forEach(([key, sfx]) => {
    sfx.stop();
    sfx.disconnect();
    delete vehicle.currentPlayingSfx[key as VehicleSfxType];
  });

  return { ...state };
}
