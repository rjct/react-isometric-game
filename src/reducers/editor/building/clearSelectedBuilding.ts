import { GameMap } from "../../../engine/GameMap";
import { Building } from "../../../engine/BuildingFactory";

export interface ClearSelectedBuildingReducerAction {
  type: "clearSelectedBuilding";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedBuilding(state: GameMap, action: ClearSelectedBuildingReducerAction): GameMap {
  return { ...state, ...{ selectedBuilding: null as unknown as Building } };
}
