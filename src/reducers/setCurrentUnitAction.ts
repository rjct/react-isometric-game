import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";

export interface SetCurrentUnitActionReducerAction {
  type: "setCurrentUnitAction";
  unit: Unit;
  selectedAction: Unit["currentSelectedAction"];
}

export function setCurrentUnitAction(state: typeof GameMap, action: SetCurrentUnitActionReducerAction) {
  action.unit.currentSelectedAction = action.selectedAction;

  return { ...state };
}
