import { GameMap } from "@src/engine/GameMap";
import { Unit } from "@src/engine/UnitFactory";

export interface SetCurrentUnitActionReducerAction {
  type: "setCurrentUnitAction";
  unit: Unit;
  selectedAction: Unit["currentSelectedAction"];
}

export function setCurrentUnitAction(state: GameMap, action: SetCurrentUnitActionReducerAction) {
  action.unit.currentSelectedAction = action.selectedAction;

  return { ...state };
}
