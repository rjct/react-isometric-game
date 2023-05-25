import { Unit } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";

export interface SetCurrentUnitActionReducerAction {
  type: "setCurrentUnitAction";
  unit: Unit;
  selectedAction: Unit["currentSelectedAction"];
}

export function setCurrentUnitAction(state: GameMap, action: SetCurrentUnitActionReducerAction) {
  action.unit.currentSelectedAction = action.selectedAction;

  const weapon = action.unit.getCurrentWeapon();

  if (weapon) {
    weapon.stopAiming();
  }

  return { ...state };
}
