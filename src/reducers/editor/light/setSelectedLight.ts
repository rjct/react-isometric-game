import { GameMap } from "../../../engine/GameMap";
import { Light } from "../../../engine/LightFactory";

export interface SetSelectedLightReducerAction {
  type: "setSelectedLight";
  entity: Light;
}

export function setSelectedLight(state: GameMap, action: SetSelectedLightReducerAction) {
  return { ...state, ...{ selectedLight: action.entity } };
}
