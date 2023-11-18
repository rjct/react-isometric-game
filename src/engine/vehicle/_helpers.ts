import { calculateIsometricAngle, degToRad, getAngleBetweenTwoGridPoints } from "@src/engine/helpers";
import Dubins from "@src/engine/vehicle/Dubins";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export function calcMovementPath(
  vehicle: Vehicle,
  targetPosition: GridCoordinates,
): {
  path: number[][];
  gearShiftMode: Vehicle["gearShiftMode"];
} {
  const vehiclePosition = {
    x: vehicle.position.grid.x, // + vehicle.size.grid.width / 2,
    y: vehicle.position.grid.y, // + vehicle.size.grid.length / 2,
  };

  const currentAngle = vehicle.rotation.deg;
  const forwardAngle = getAngleBetweenTwoGridPoints(vehiclePosition, targetPosition, true).deg;
  const reverseAngle = forwardAngle > 180 ? forwardAngle - 180 : forwardAngle + 180;

  const angleDiffForward = Math.abs(forwardAngle - currentAngle);
  const angleDiffReverse = Math.abs(reverseAngle - currentAngle);

  const shouldMoveInReverse = angleDiffReverse > angleDiffForward;

  const path = new Dubins().getPath(
    [
      vehiclePosition.x,
      vehiclePosition.y,
      vehicle.rotation.rad - degToRad(90) + degToRad(shouldMoveInReverse ? 180 : 0),
    ],
    [targetPosition.x, targetPosition.y, calculateIsometricAngle(vehiclePosition, targetPosition).rad],
    vehicle.dictEntity.turningRadius,
    0.5,
  );

  return {
    path,
    gearShiftMode: shouldMoveInReverse ? "reverse" : "drive",
  };
}

export function calcCollisionRollbackPosition(vehicle: Vehicle): GridCoordinates {
  const rollbackDistance = 1;
  const vehicleAngle = vehicle.rotation.rad;
  const rollbackAngle = vehicleAngle + degToRad(90) - (vehicle.gearShiftMode === "reverse" ? degToRad(180) : 0);

  const position = vehicle.position.grid;

  return {
    x: position.x + rollbackDistance * Math.cos(rollbackAngle),
    y: position.y + rollbackDistance * Math.sin(rollbackAngle),
  };
}
