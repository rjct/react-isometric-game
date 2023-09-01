import { GameMap } from "@src/engine/GameMap";
import { Unit } from "@src/engine/UnitFactory";

export interface SetSelectedUnitReducerAction {
  type: "setSelectedUnit";
  entity: Unit;
}

export function setSelectedUnit(state: GameMap, action: SetSelectedUnitReducerAction) {
  return { ...state, ...{ selectedUnit: action.entity } };
}
