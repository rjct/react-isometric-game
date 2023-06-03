import { Unit } from "../../../engine/UnitFactory";
import { GameMap } from "../../../engine/GameMap";

export type MoveUnitReducerAction = {
  type: "moveUnit";
  unit: Unit;
  position: Unit["position"];
  moveAction: Extract<Unit["action"], "walk" | "run">;
};

export function moveUnit(state: GameMap, action: MoveUnitReducerAction): GameMap {
  const unit = action.unit;

  if (unit) {
    //if (unit.isMoving()) return state;

    if (unit.path.length > 0) {
      state.deOccupyCell(unit.position);

      unit.path.forEach((pathPoint) => {
        state.deOccupyCell(pathPoint);
      });

      unit.clearPath();
      unit.pathQueue.distAlong = 0;
      unit.pathQueue.totalDistMoved = 0;
      unit.pathQueue.points = [];
      unit.pathQueue.atEnd = false;
      unit.pathQueue.currentPos = unit.position;
    }

    const unitPath = state.calcUnitPath(unit, action.position);

    if (unitPath.length > 0) {
      unit.setPath(unitPath);
      unit.setAction(action.moveAction);
    }
  }

  return { ...state };
}
