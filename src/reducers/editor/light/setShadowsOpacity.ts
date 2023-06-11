import { GameMap } from "../../../engine/GameMap";

export interface SetShadowsOpacityReducerAction {
  type: "setShadowsOpacity";
  opacity: number;
}

export function setShadowsOpacity(state: GameMap, action: SetShadowsOpacityReducerAction) {
  return { ...state, ...{ shadows: { ...state.shadows, ...{ opacity: action.opacity } } } };
}
