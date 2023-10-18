import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { pathFinderAStar } from "@src/engine/unit/pathFinder";
import { Unit } from "@src/engine/unit/UnitFactory";

export type AnimateUnitMoveReducerAction = {
  type: "animateUnitMove";
  units: Array<Unit>;
  deltaTime: number;
  consumeActionPoints?: boolean;
};

export function animateUnitMove(state: GameMap, action: AnimateUnitMoveReducerAction) {
  const units = action.units.filter((unit) => unit.path.length > 0);

  for (const unit of units) {
    const unitPosition = { ...unit.position };

    unit.pathQueue.points = unit.path;
    unit.pathQueue.currentPos = unit.position;
    unit.pathQueue.destinationPos = unit.path[unit.path.length - 1];

    const speed = unit.getCurrentSpeed();
    const prevPoint = unit.pathQueue.moveAlong(action.deltaTime * speed);

    if (prevPoint) {
      state.deOccupyCell(prevPoint);

      if (action.consumeActionPoints) {
        const currentSelectedAction = unit.currentSelectedAction;

        if (currentSelectedAction === "move") {
          unit.consumeActionPoints(unit.actionPoints.consumption[unit.currentMovementMode]);
        }
      }

      if (unit.path.length > 1 && state.isCellOccupied(unit.path[1])) {
        const unitPath = pathFinderAStar(state.matrix, unit.path[0], unit.pathQueue.destinationPos);

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
      unit.setDirection(getAngleBetweenTwoGridPoints(unit.pathQueue.currentPos, unitPosition));
    }

    unit.setPosition(unit.pathQueue.currentPos, state, action.deltaTime);

    if (unit.isHero) {
      state.setVisitedCell(unit.pathQueue.currentPos);
    }

    if (unit.pathQueue.atEnd) {
      unit.clearPath();
      unit.setAction("none");
      unit.pathQueue.atEnd = false;
      unit.setPositionComplete();
    }
  }

  return { ...state };
}
