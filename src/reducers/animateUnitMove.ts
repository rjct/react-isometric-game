import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";
import { pathFinder } from "../engine/pathFinder";

export type AnimateUnitMoveReducerAction = {
  type: "animateUnitMove";
  unit: Unit;
  deltaTime: number;
};

export function animateUnitMove(state: typeof GameMap, action: AnimateUnitMoveReducerAction) {
  const unit = action.unit;

  if (unit) {
    if (unit.path.length === 0) return state;

    const unitPosition = { ...unit.position };

    unit.pathQueue.points = unit.path;
    unit.pathQueue.currentPos = unit.position;
    unit.pathQueue.destinationPos = unit.path[unit.path.length - 1];

    const speed = unit.action === "run" ? unit.speed.run : unit.speed.walk;
    const prevPoint = unit.pathQueue.moveAlong(action.deltaTime * speed);

    if (prevPoint) {
      state.deOccupyCell(prevPoint);

      if (unit.path.length > 1 && state.isCellOccupied(unit.path[1].x, unit.path[1].y)) {
        const unitPath = pathFinder(state.matrix, unit.path[0], unit.pathQueue.destinationPos);

        unit.setPath(unitPath);

        if (unitPath.length === 0) {
          const prevPath = unit.pathQueue.points;
          prevPath.pop();

          unit.setPath(unit.convertCoordinatesToPathArray(prevPath));
        }
      }
    }

    state.occupyCell(unit.position);

    if (unit.pathQueue.points.length > 1) {
      unit.setDirection(
        Math.atan2(unit.pathQueue.currentPos.y - unitPosition.y, unit.pathQueue.currentPos.x - unitPosition.x) *
          (180 / Math.PI)
      );
    }

    unit.setPosition(unit.pathQueue.currentPos);

    if (unit.id === state.heroId) {
      state.setVisitedCell(unit.pathQueue.currentPos);
    }

    if (unit.pathQueue.atEnd) {
      unit.clearPath();
      unit.setAction("none");
      unit.pathQueue.atEnd = false;
    }
  }

  return { ...state };
}
