import { Building } from "@src/engine/building/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type SetSelectedEntityForInventoryTransferReducerAction = {
  type: "setSelectedEntityForInventoryTransfer";
  entity: Unit | Building | Vehicle | null;
};

export function setSelectedEntityForInventoryTransfer(
  state: GameMap,
  action: SetSelectedEntityForInventoryTransferReducerAction,
): GameMap {
  return {
    ...state,
    ...{ selectedEntityForInventoryTransfer: action.entity },
  };
}
