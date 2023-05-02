import { Unit } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";

export type HighlightUnitPathReducerAction = {
  type: "highlightUnitPath";
  unit: Unit;
  path: Array<Array<number>>;
};

export function highlightUnitPath(state: GameMap, action: HighlightUnitPathReducerAction) {
  const path = action.path || [[]];

  if (path.length > 1) {
    state.highlightWireframePath(path);
  }

  return { ...state };
}
