import { GameMap } from "@src/engine/gameMap";

export interface SetGlobalShadowsColorReducerAction {
  type: "setGlobalShadowsColor";
  color: string;
}

export function setGlobalShadowsColor(state: GameMap, action: SetGlobalShadowsColorReducerAction) {
  return { ...state, ...{ shadows: { ...state.globalShadows, ...{ color: action.color } } } };
}
