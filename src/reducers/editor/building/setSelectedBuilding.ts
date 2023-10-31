import { Building } from "@src/engine/building/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";

export interface SetSelectedBuildingReducerAction {
  type: "setSelectedBuilding";
  entity: Building;
}

export function setSelectedBuilding(state: GameMap, action: SetSelectedBuildingReducerAction) {
  return { ...state, ...{ selectedBuilding: action.entity } };
}
