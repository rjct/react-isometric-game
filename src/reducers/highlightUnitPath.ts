import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";

export type HighlightUnitPathReducerAction = {
  type: "highlightUnitPath";
  unit: Unit;
  path: Array<Array<number>>;
};

export function highlightUnitPath(state: typeof GameMap, action: HighlightUnitPathReducerAction) {
  const path = action.path || [[]];

  if (path.length > 1) {
    state.highlightWireframePath(path);
  }

  return { ...state };
}
