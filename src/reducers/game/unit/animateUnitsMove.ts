import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { pathFinderAStar } from "@src/engine/unit/pathFinder";
import { Unit } from "@src/engine/unit/UnitFactory";

export type AnimateUnitsMoveReducerAction = {
  type: "animateUnitsMove";
  entities: Array<Unit>;
  deltaTime: number;
  consumeActionPoints?: boolean;
};

export function animateUnitsMove(state: GameMap, action: AnimateUnitsMoveReducerAction) {
  let isStateChanged = false;

  for (const entity of action.entities) {
    if (entity.path.length === 0) continue;

    if (entity.isVehicleInUse()) {
      continue;
    }

    isStateChanged = true;
    state.setGridMatrixOccupancy([entity], -1);

    const entityPosition = { ...entity.position.grid };

    entity.pathQueue.points = entity.path;
    entity.pathQueue.currentPos = entity.position.grid;
    entity.pathQueue.destinationPos = entity.path[entity.path.length - 1];

    const speed = entity.getCurrentSpeed();
    const prevPoint = entity.pathQueue.moveAlong(action.deltaTime * speed);

    if (prevPoint) {
      // if (action.consumeActionPoints) {
      //   const currentSelectedAction = entity.currentSelectedAction;
      //
      //   if (currentSelectedAction === "move") {
      //     entity.consumeActionPoints(entity.actionPoints.consumption[entity.currentMovementMode]);
      //   }
      // }

      if (entity.path.length > 1 && state.isCellOccupied(entity.path[1])) {
        const unitPath = pathFinderAStar(state.matrix, entity.path[0], entity.pathQueue.destinationPos);

        entity.setPath(unitPath);

        if (unitPath.length === 0) {
          const prevPath = entity.pathQueue.points;

          prevPath.pop();

          if (prevPath.length > 1 && state.isCellOccupied(prevPath[1])) {
            while (prevPath.length > 1 && state.isCellOccupied(prevPath[1])) {
              prevPath.pop();
            }
          }

          if (prevPath.length > 1) {
            entity.setPath(entity.convertCoordinatesToPathArray(prevPath));
          } else {
            entity.clearPath();
            entity.pathQueue.points = [];
            entity.pathQueue.atEnd = true;
            entity.pathQueue.currentPos = entity.position.grid;
          }
        }
      }
    }

    if (
      entity.pathQueue.points.length > 1 &&
      getDistanceBetweenGridPoints(entity.pathQueue.currentPos, entityPosition) > 0
    ) {
      entity.setRotation(getAngleBetweenTwoGridPoints(entity.pathQueue.currentPos, entityPosition));
    }

    entity.setPosition(entity.pathQueue.currentPos, state, action.deltaTime);

    if (entity.pathQueue.atEnd) {
      entity.clearPath();
      entity.setAction("none");
      entity.pathQueue.atEnd = false;
      entity.setPositionComplete();
    }

    state.setGridMatrixOccupancy([entity], 1);
  }

  return isStateChanged ? { ...state } : state;
}
