import { GameTerrain } from "@src/context/GameTerrainContext";

export interface DeleteSelectedTerrainAreaReducerAction {
  type: "deleteSelectedTerrainArea";
  entityId: string;
}

export function deleteSelectedTerrainArea(
  state: GameTerrain,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action: DeleteSelectedTerrainAreaReducerAction,
): GameTerrain {
  if (state.deleteSelectedTerrainArea()) {
    return { ...state };
  }

  return state;
}
