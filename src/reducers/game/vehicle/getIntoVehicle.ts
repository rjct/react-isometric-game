import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type GetIntoVehicleReducerAction = {
  type: "getIntoVehicle";
  unit: Unit;
  vehicle: Vehicle;
};

export function getIntoVehicle(state: GameMap, action: GetIntoVehicleReducerAction) {
  const { unit, vehicle } = action;

  state.deOccupyCell(unit.getRoundedPosition());
  unit.getIntoVehicle(vehicle);
  vehicle.assignDriver(unit);

  const turnOnSfx = state.createSfx([vehicle.dictEntity.sfx["turnOn"].src], 1);
  const idleSfx = state.createSfx([vehicle.dictEntity.sfx["idle"].src], 1);

  if (turnOnSfx) {
    const stopTime = turnOnSfx.buffer!.duration * 1000 - 265;

    if (idleSfx) {
      window.setTimeout(() => {
        vehicle.currentPlayingSfx["idle"] = idleSfx;

        idleSfx.loop = true;
        idleSfx.start();
      }, stopTime);
    }

    turnOnSfx.start();
  }

  // vehicle.currentPlayingSfx[]
  //
  // state.playSfx([vehicle.dictEntity.sfx["turnOn"].src], 1, 0).then((a) => {
  //   console.log(a);
  //   state.playSfx([vehicle.dictEntity.sfx["idle"].src], 1, 0);
  // });

  return { ...state };
}
