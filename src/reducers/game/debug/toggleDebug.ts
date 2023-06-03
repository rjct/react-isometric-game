import { GameMap } from "../../../engine/GameMap";

export type ToggleDebugReducerAction = {
  type: "toggleDebug";
  debugEnabled: boolean;
};

export function toggleDebug(state: GameMap, action: ToggleDebugReducerAction): GameMap {
  return {
    ...state,
    ...{
      debug: {
        ...state.debug,
        ...{ enabled: action.debugEnabled },
      },
    },
  };
}
