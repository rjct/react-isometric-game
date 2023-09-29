import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export type HighlightExplorableEntityReducerAction = {
  type: "highlightExplorableEntity";
  entity: Unit | Building | null;
};

export function highlightExplorableEntity(state: GameMap, action: HighlightExplorableEntityReducerAction): GameMap {
  return {
    ...state,
    ...{ highlightedEntityForInventoryTransfer: action.entity },
  };
}
