import { Unit } from "../engine/UnitFactory";
import { pathFinder } from "../engine/pathFinder";
import { GameMap } from "../engine/GameMap";

export type MoveUnitReducerAction = {
  type: "moveUnit";
  unit: Unit;
  position: Unit["position"];
  moveAction: Extract<Unit["action"], "walk" | "run">;
};

export function moveUnit(state: typeof GameMap, action: MoveUnitReducerAction): typeof GameMap {
  const unit = action.unit;

  if (unit) {
    if (unit.isMoving()) return state;

    const newPosition = action.position as Unit["position"];

    const unitPath = pathFinder(
      state.matrix,
      { x: unit.position.x, y: unit.position.y },
      { x: Math.min(state.mapSize.width - 1, newPosition.x), y: Math.min(state.mapSize.height - 1, newPosition.y) }
    );

    state.clearHighlightWireframePath();

    if (unitPath.length > 0) {
      unit.setPath(unitPath);
      unit.setAction(action.moveAction);
    }
  }

  return { ...state };
}
