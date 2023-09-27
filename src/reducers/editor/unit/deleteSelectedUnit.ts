import { GameMap } from "@src/engine/gameMap";

export interface DeleteSelectedUnitReducerAction {
  type: "deleteSelectedUnit";
  entityId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteSelectedUnit(state: GameMap, action: DeleteSelectedUnitReducerAction): GameMap {
  if (state.deleteSelectedUnit()) {
    return { ...state };
  }

  return state;
}
