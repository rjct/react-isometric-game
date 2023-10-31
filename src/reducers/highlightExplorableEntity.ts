import { Building } from "@src/engine/building/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type HighlightExplorableEntityReducerAction = {
  type: "highlightExplorableEntity";
  entity: Unit | Building | Vehicle | null;
};

export function highlightExplorableEntity(state: GameMap, action: HighlightExplorableEntityReducerAction): GameMap {
  return {
    ...state,
    ...{ highlightedEntityForInventoryTransfer: action.entity },
  };
}
