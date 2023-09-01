import { GameMap } from "@src/engine/GameMap";

export interface SetBuildingDirectionReducerAction {
  type: "setBuildingDirection";
  entityId: string;
  direction: Direction;
}

export function setBuildingDirection(state: GameMap, action: SetBuildingDirectionReducerAction): GameMap {
  const entity = state.getBuildingById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], state.matrix, -1);
    entity.setDirection(action.direction);
    state.setGridMatrixOccupancy([entity], state.matrix, 1);

    return { ...state };
  }

  return state;
}
