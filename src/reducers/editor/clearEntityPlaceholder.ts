import { GameMap } from "@src/engine/GameMap";

export interface ClearEntityPlaceholderReducerAction {
  type: "clearEntityPlaceholder";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function clearEntityPlaceholder(state: GameMap, action: ClearEntityPlaceholderReducerAction): GameMap {
  return {
    ...state,
    ...{
      entityPlaceholder: null,
    },
  };
}
