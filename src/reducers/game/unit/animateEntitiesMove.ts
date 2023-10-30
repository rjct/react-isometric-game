import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { pathFinderAStar } from "@src/engine/unit/pathFinder";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type AnimateEntitiesMoveReducerAction = {
  type: "animateEntitiesMove";
  entities: Array<Unit | Vehicle>;
  deltaTime: number;
  consumeActionPoints?: boolean;
};

export function animateEntitiesMove(state: GameMap, action: AnimateEntitiesMoveReducerAction) {
  let isStateChanged = false;

  state.setGridMatrixOccupancy(action.entities, -1);

  for (const entity of action.entities) {
    if (entity.path.length === 0) continue;

    if (entity instanceof Unit && entity.isVehicleInUse()) {
      continue;
    }

    if (entity instanceof Vehicle) {
      if (entity.speed.current === 0) {
        continue;
      }

      if (entity.isCollisionDetected()) {
        continue;
      }
    }

    isStateChanged = true;

    const entityPosition = { ...entity.position.grid };

    entity.pathQueue.points = entity.path;
    entity.pathQueue.currentPos = entity.position.grid;
    entity.pathQueue.destinationPos = entity.path[entity.path.length - 1];

    const speed = entity.getCurrentSpeed();
    const prevPoint = entity.pathQueue.moveAlong(action.deltaTime * speed);

    //state.deOccupyArea(entity.getRoundedPosition(), entity.size.grid);

    if (prevPoint) {
      //state.deOccupyCell(prevPoint);

      //state.deOccupyArea(prevPoint, entity.size.grid);

      // if (action.consumeActionPoints) {
      //   const currentSelectedAction = entity.currentSelectedAction;
      //
      //   if (currentSelectedAction === "move") {
      //     entity.consumeActionPoints(entity.actionPoints.consumption[entity.currentMovementMode]);
      //   }
      // }

      if (entity instanceof Unit && entity.path.length > 1 && state.isCellOccupied(entity.path[1])) {
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

      //state.occupyArea(entity.pathQueue.currentPos, entity.size.grid);
      //state.occupyCell(entity.position.grid);
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
  }

  state.setGridMatrixOccupancy(action.entities, 1);

  return isStateChanged ? { ...state } : state;
}
