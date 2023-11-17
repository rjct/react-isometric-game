import { GameMap } from "@src/engine/gameMap";
import { degToRad, getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { normalizeRotation } from "@src/engine/weapon/helpers";

function _calculateRollbackPosition(vehicle: Vehicle): GridCoordinates {
  const rollbackDistance = 2;
  const rollbackAngle = vehicle.rotation.rad + degToRad(90);

  const position = vehicle.getRoundedPosition();

  return {
    x: position.x + rollbackDistance * Math.cos(rollbackAngle),
    y: position.y + rollbackDistance * Math.sin(rollbackAngle),
  };
}

export type AnimateVehiclesMoveReducerAction = {
  type: "animateVehiclesMove";
  entities: Array<Vehicle>;
  deltaTime: number;
  consumeActionPoints?: boolean;
};

export function animateVehiclesMove(state: GameMap, action: AnimateVehiclesMoveReducerAction) {
  let isStateChanged = false;

  for (const vehicle of action.entities) {
    if (vehicle.path.length === 0 || vehicle.speed.current === 0) continue;

    isStateChanged = true;
    state.setGridMatrixOccupancy([vehicle], -1);

    const entityPosition = { ...vehicle.position.grid };

    if (vehicle.isCollisionDetected()) {
      vehicle.stop();

      vehicle.setRotation(normalizeRotation(vehicle.realRotation.deg, 4));
      vehicle.setPosition(_calculateRollbackPosition(vehicle), state);
      vehicle.setAction("collision");

      state.setGridMatrixOccupancy([vehicle], 1);

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
      vehicle.setAction("idle");
      vehicle.pathQueue.atEnd = false;
      vehicle.setPositionComplete();
    }

    state.setGridMatrixOccupancy([vehicle], 1);
  }

  return isStateChanged ? { ...state } : state;
}
