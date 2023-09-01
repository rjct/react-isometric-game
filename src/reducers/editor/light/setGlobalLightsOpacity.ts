import { GameMap } from "@src/engine/GameMap";

export interface SetGlobalLightsOpacityReducerAction {
  type: "setGlobalLightsOpacity";
  opacity: number;
}

export function setGlobalLightsOpacity(state: GameMap, action: SetGlobalLightsOpacityReducerAction) {
  return { ...state, ...{ globalLights: { ...state.globalLights, ...{ opacity: action.opacity } } } };
}
