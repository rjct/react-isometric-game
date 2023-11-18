import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { calcCollisionRollbackPosition } from "@src/engine/vehicle/_helpers";
import { normalizeRotation } from "@src/engine/weapon/helpers";

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
      vehicle.setPosition(calcCollisionRollbackPosition(vehicle), state);
      vehicle.setRotation(normalizeRotation(vehicle.realRotation.deg, 4));

      vehicle.stop();
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
      const reverseAngle = vehicle.gearShiftMode === "reverse" ? 180 : 0;
      const angle = getAngleBetweenTwoGridPoints(vehicle.pathQueue.currentPos, entityPosition, undefined, reverseAngle);

      vehicle.setRotation(angle);
    }

    vehicle.setPosition(vehicle.pathQueue.currentPos, state);

    if (vehicle.pathQueue.atEnd) {
      vehicle.stop();

      vehicle.setPositionComplete();
    }

    state.setGridMatrixOccupancy([vehicle], 1);
  }

  return isStateChanged ? { ...state } : state;
}
