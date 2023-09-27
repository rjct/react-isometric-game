import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface ClearSelectedUnitReducerAction {
  type: "clearSelectedUnit";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedUnit(state: GameMap, action: ClearSelectedUnitReducerAction): GameMap {
  return { ...state, ...{ selectedUnit: null as unknown as Unit } };
}
