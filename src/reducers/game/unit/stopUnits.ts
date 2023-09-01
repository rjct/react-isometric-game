import { GameMap } from "@src/engine/GameMap";
import { Unit } from "@src/engine/UnitFactory";

export type StopUnitsActionReducerAction = {
  type: "stopUnits";
  units: Array<Unit>;
};

export function stopUnits(state: GameMap, action: StopUnitsActionReducerAction) {
  for (const unit of action.units) {
    unit.stop();
  }

  return { ...state };
}
