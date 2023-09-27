import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";

export interface ClearSelectedBuildingReducerAction {
  type: "clearSelectedBuilding";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedBuilding(state: GameMap, action: ClearSelectedBuildingReducerAction): GameMap {
  return { ...state, ...{ selectedBuilding: null as unknown as Building } };
}
