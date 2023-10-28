import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export type GetOutOfVehicleReducerAction = {
  type: "getOutOfVehicle";
  unit: Unit;
};

export function getOutOfVehicle(state: GameMap, action: GetOutOfVehicleReducerAction) {
  const vehicle = action.unit.getVehicleInUse();

  if (!vehicle) return state;

  action.unit.getOutOfVehicle();
  vehicle.unAssignDriver();
  vehicle.clearPath();

  const idleSfx = vehicle.currentPlayingSfx["idle"];

  if (idleSfx) {
    const turnOffSfx = state.createSfx([vehicle.dictEntity.sfx["turnOff"].src], 1);

    turnOffSfx?.start();

    window.setTimeout(() => {
      idleSfx.stop();
      delete vehicle.currentPlayingSfx["idle"];
    }, 100);
  }

  return { ...state };
}
