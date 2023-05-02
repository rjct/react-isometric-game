import { GameMap } from "../engine/GameMap";
import { Building } from "../engine/BuildingFactory";

export interface SetSelectedEntityReducerAction {
  type: "setSelectedEntity";
  entity: Building;
}

export function setSelectedEntity(state: GameMap, action: SetSelectedEntityReducerAction) {
  return { ...state, ...{ selectedEntity: action.entity } };
}
