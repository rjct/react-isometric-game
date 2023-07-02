import { GameMap } from "../../../engine/GameMap";

export interface SetBuildingOccupiesCellReducerAction {
  type: "setBuildingOccupiesCell";
  entityId: string;
  value: boolean;
}
export function setBuildingOccupiesCell(state: GameMap, action: SetBuildingOccupiesCellReducerAction): GameMap {
  const building = state.getBuildingById(action.entityId);

  if (building) {
    state.setGridMatrixOccupancy([building], state.matrix, action.value ? 1 : -1);

    building.occupiesCell = action.value;

    return { ...state };
  }

  return state;
}
