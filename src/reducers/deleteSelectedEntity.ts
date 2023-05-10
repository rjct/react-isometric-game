import { GameMap } from "../engine/GameMap";

export interface DeleteSelectedEntityReducerAction {
  type: "deleteSelectedEntity";
  entityId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteSelectedEntity(state: GameMap, action: DeleteSelectedEntityReducerAction): GameMap {
  if (state.deleteSelectedEntity()) {
    return { ...state };
  }

  return state;
}
