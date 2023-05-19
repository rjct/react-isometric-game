import { GameMap } from "../../../engine/GameMap";

export interface DeleteSelectedBuildingReducerAction {
  type: "deleteSelectedBuilding";
  entityId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteSelectedBuilding(state: GameMap, action: DeleteSelectedBuildingReducerAction): GameMap {
  if (state.deleteSelectedBuilding()) {
    return { ...state };
  }

  return state;
}
