import { Unit } from "../../../engine/UnitFactory";
import { pathFinder } from "../../../engine/pathFinder";
import { GameMap } from "../../../engine/GameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "../../../engine/helpers";

export type AnimateUnitMoveReducerAction = {
  type: "animateUnitMove";
  unit: Unit;
  deltaTime: number;
};

export function animateUnitMove(state: GameMap, action: AnimateUnitMoveReducerAction) {
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

      if (unit.path.length > 1 && state.isCellOccupied(unit.path[1])) {
        const unitPath = pathFinder(state.matrix, unit.path[0], unit.pathQueue.destinationPos);

        unit.setPath(unitPath);

        if (unitPath.length === 0) {
          const prevPath = unit.pathQueue.points;

          prevPath.pop();

          if (prevPath.length > 1 && state.isCellOccupied(prevPath[1])) {
            while (prevPath.length > 1 && state.isCellOccupied(prevPath[1])) {
              prevPath.pop();
            }
          }

          if (prevPath.length > 1) {
            unit.setPath(unit.convertCoordinatesToPathArray(prevPath));
          } else {
            unit.clearPath();
            unit.pathQueue.points = [];
            unit.pathQueue.atEnd = true;
            unit.pathQueue.currentPos = unit.position;
          }
        }
      }

      state.occupyCell(unit.position);
    }

    if (unit.pathQueue.points.length > 1 && getDistanceBetweenGridPoints(unit.pathQueue.currentPos, unitPosition) > 0) {
      unit.setDirection(getAngleBetweenTwoGridPoints(unit.pathQueue.currentPos, unitPosition).deg);
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
