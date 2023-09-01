import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/GameMap";

export interface SetSelectedBuildingReducerAction {
  type: "setSelectedBuilding";
  entity: Building;
}

export function setSelectedBuilding(state: GameMap, action: SetSelectedBuildingReducerAction) {
  return { ...state, ...{ selectedBuilding: action.entity } };
}
