import { GameMap } from "@src/engine/GameMap";

export interface DeleteSelectedLightReducerAction {
  type: "deleteSelectedLight";
  entityId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteSelectedLight(state: GameMap, action: DeleteSelectedLightReducerAction): GameMap {
  if (state.deleteSelectedLight()) {
    return { ...state };
  }

  return state;
}
