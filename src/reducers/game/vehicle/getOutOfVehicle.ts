import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export type GetOutOfVehicleReducerAction = {
  type: "getOutOfVehicle";
  unit: Unit;
};

export function getOutOfVehicle(state: GameMap, action: GetOutOfVehicleReducerAction) {
  const vehicle = action.unit.getVehicleInUse();

  if (!vehicle) return state;

  const { unit } = action;

  unit.getOutOfVehicle();
  unit.currentSelectedAction = "move";
  unit.setPosition(
    {
      x: vehicle.position.grid.x - vehicle.size.grid.width / 2,
      y: vehicle.position.grid.y - vehicle.size.grid.length / 2,
    },
    state,
  );
  unit.setRotation(vehicle.rotation);

  vehicle.unAssignDriver();
  vehicle.clearPath();
  state.setGridMatrixOccupancy([unit], 1);

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
