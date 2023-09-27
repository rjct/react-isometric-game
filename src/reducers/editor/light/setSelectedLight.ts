import { GameMap } from "@src/engine/gameMap";
import { Light } from "@src/engine/light/LightFactory";

export interface SetSelectedLightReducerAction {
  type: "setSelectedLight";
  entity: Light;
}

export function setSelectedLight(state: GameMap, action: SetSelectedLightReducerAction) {
  return { ...state, ...{ selectedLight: action.entity } };
}
