import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface SetUnitMovementModeReducerAction {
  type: "setUnitMovementMode";
  unit: Unit;
  mode: Unit["currentMovementMode"];
}

export function setUnitMovementMode(state: GameMap, action: SetUnitMovementModeReducerAction) {
  action.unit.currentMovementMode = action.mode;

  return { ...state };
}
