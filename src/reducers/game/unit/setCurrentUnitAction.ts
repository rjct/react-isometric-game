import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface SetCurrentUnitActionReducerAction {
  type: "setCurrentUnitAction";
  unit: Unit;
  selectedAction: Unit["currentSelectedAction"];
}

export function setCurrentUnitAction(state: GameMap, action: SetCurrentUnitActionReducerAction) {
  action.unit.currentSelectedAction = action.selectedAction;

  return { ...state };
}
