import { GameMap } from "../../../engine/GameMap";
import { Unit } from "../../../engine/UnitFactory";

export interface SetSelectedUnitReducerAction {
  type: "setSelectedUnit";
  entity: Unit;
}

export function setSelectedUnit(state: GameMap, action: SetSelectedUnitReducerAction) {
  return { ...state, ...{ selectedUnit: action.entity } };
}
