import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export type SetSelectedEntityForInventoryTransferReducerAction = {
  type: "setSelectedEntityForInventoryTransfer";
  entity: Unit | Building | null;
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
