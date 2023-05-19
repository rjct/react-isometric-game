import { GameMap } from "../../../engine/GameMap";

export interface DeleteSelectedTerrainAreaReducerAction {
  type: "deleteSelectedTerrainArea";
  entityId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteSelectedTerrainArea(state: GameMap, action: DeleteSelectedTerrainAreaReducerAction): GameMap {
  if (state.deleteSelectedTerrainArea()) {
    return { ...state };
  }

  return state;
}
