import { VehicleType } from "@src/dict/vehicle/_vehicle";
import { GameMap } from "@src/engine/gameMap";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export interface AddVehicleReducerAction {
  type: "addVehicle";
  vehicleType: VehicleType;
  position: GridCoordinates;
  rotation: AngleInDegrees;
}

export function addVehicle(state: GameMap, action: AddVehicleReducerAction): GameMap {
  const vehicle = new Vehicle({
    gameState: state,
    type: action.vehicleType,
    position: action.position,
    rotation: action.rotation,
  });

  vehicle.setPosition(action.position, state);

  state.vehicles.push(vehicle);
  state.setGridMatrixOccupancy([vehicle]);

  return {
    ...state,
    ...{
      selectedVehicle: vehicle,
    },
  };
}
