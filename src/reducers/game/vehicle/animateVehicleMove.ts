import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type AnimateVehiclesMoveReducerAction = {
  type: "animateVehiclesMove";
  entities: Array<Vehicle>;
  deltaTime: number;
  consumeActionPoints?: boolean;
};

export function animateVehiclesMove(state: GameMap, action: AnimateVehiclesMoveReducerAction) {
  let isStateChanged = false;

  state.setGridMatrixOccupancy(action.entities, -1);

  for (const entity of action.entities) {
    if (entity.path.length === 0 || entity.speed.current === 0) continue;

    // FIXME:
    // if (entity.isCollisionDetected()) {
    //   continue;
    // }

    isStateChanged = true;

    const entityPosition = { ...entity.position.grid };

    entity.pathQueue.points = entity.path;
    entity.pathQueue.currentPos = entity.position.grid;
    entity.pathQueue.destinationPos = entity.path[entity.path.length - 1];

    const speed = entity.getCurrentSpeed();
    const prevPoint = entity.pathQueue.moveAlong(action.deltaTime * speed);

    if (prevPoint) {
      entity.setPosition(prevPoint, state);
    }

    if (getDistanceBetweenGridPoints(entity.pathQueue.currentPos, entityPosition) > 0) {
      entity.setRotation(getAngleBetweenTwoGridPoints(entity.pathQueue.currentPos, entityPosition));
    }

    entity.setPosition(entity.pathQueue.currentPos, state);

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
