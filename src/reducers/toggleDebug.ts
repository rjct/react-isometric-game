import { GameMap } from "../engine/GameMap";

export type ToggleDebugReducerAction = {
  type: "toggleDebug";
  debugEnabled: boolean;
};

export function toggleDebug(state: typeof GameMap, action: ToggleDebugReducerAction) {
  return {
    ...state,
    ...{ debug: action.debugEnabled },
  };
}
