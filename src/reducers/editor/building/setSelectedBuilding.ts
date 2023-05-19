import { GameMap } from "../../../engine/GameMap";
import { Building } from "../../../engine/BuildingFactory";

export interface SetSelectedBuildingReducerAction {
  type: "setSelectedBuilding";
  entity: Building;
}

export function setSelectedBuilding(state: GameMap, action: SetSelectedBuildingReducerAction) {
  return { ...state, ...{ selectedBuilding: action.entity } };
}
