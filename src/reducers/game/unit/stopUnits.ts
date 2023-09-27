import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

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
