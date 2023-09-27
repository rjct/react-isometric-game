import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface SetSelectedUnitReducerAction {
  type: "setSelectedUnit";
  entity: Unit;
}

export function setSelectedUnit(state: GameMap, action: SetSelectedUnitReducerAction) {
  return { ...state, ...{ selectedUnit: action.entity } };
}
