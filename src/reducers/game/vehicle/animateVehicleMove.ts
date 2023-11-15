import { GameMap } from "@src/engine/gameMap";
import { degToRad, getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type AnimateVehiclesMoveReducerAction = {
  type: "animateVehiclesMove";
  entities: Array<Vehicle>;
  deltaTime: number;
  consumeActionPoints?: boolean;
};

function calculateRollbackPosition(vehicle: Vehicle): GridCoordinates {
  const rollbackDistance = 2;
  const rollbackAngle = vehicle.rotation.rad + degToRad(90);

  return {
    x: vehicle.position.grid.x + rollbackDistance * Math.cos(rollbackAngle),
    y: vehicle.position.grid.y + rollbackDistance * Math.sin(rollbackAngle),
  };
}

export function animateVehiclesMove(state: GameMap, action: AnimateVehiclesMoveReducerAction) {
  let isStateChanged = false;

  state.setGridMatrixOccupancy(action.entities, -1);

  for (const vehicle of action.entities) {
    if (vehicle.path.length === 0 || vehicle.speed.current === 0) continue;

    isStateChanged = true;

    const entityPosition = { ...vehicle.position.grid };

    if (vehicle.isCollisionDetected()) {
      vehicle.clearPath();
      vehicle.speed.current = 0;

      vehicle.setPosition(calculateRollbackPosition(vehicle), state);

      continue;
    }

    vehicle.pathQueue.points = vehicle.path;
    vehicle.pathQueue.currentPos = vehicle.position.grid;
    vehicle.pathQueue.destinationPos = vehicle.path[vehicle.path.length - 1];

    const speed = vehicle.getCurrentSpeed();
    const prevPoint = vehicle.pathQueue.moveAlong(action.deltaTime * speed);

    if (prevPoint) {
      vehicle.setPosition(prevPoint, state);
    }

    if (getDistanceBetweenGridPoints(vehicle.pathQueue.currentPos, entityPosition) > 0) {
      vehicle.setRotation(getAngleBetweenTwoGridPoints(vehicle.pathQueue.currentPos, entityPosition));
    }

    vehicle.setPosition(vehicle.pathQueue.currentPos, state);

    if (vehicle.pathQueue.atEnd) {
      vehicle.clearPath();
      vehicle.setAction("none");
      vehicle.pathQueue.atEnd = false;
      vehicle.setPositionComplete();
    }
  }

  state.setGridMatrixOccupancy(action.entities, 1);

  return isStateChanged ? { ...state } : state;
}
