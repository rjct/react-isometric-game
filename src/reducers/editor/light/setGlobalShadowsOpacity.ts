import { GameMap } from "@src/engine/gameMap";

export interface SetGlobalShadowsOpacityReducerAction {
  type: "setGlobalShadowsOpacity";
  opacity: number;
}

export function setGlobalShadowsOpacity(state: GameMap, action: SetGlobalShadowsOpacityReducerAction) {
  return { ...state, ...{ globalShadows: { ...state.globalShadows, ...{ opacity: action.opacity } } } };
}
