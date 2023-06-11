import { GameMap } from "../../../engine/GameMap";

export interface SetShadowsColorReducerAction {
  type: "setShadowsColor";
  color: string;
}

export function setShadowsColor(state: GameMap, action: SetShadowsColorReducerAction) {
  return { ...state, ...{ shadows: { ...state.shadows, ...{ color: action.color } } } };
}
