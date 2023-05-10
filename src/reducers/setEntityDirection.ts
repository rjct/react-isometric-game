import { GameMap } from "../engine/GameMap";

export interface SetEntityDirectionReducerAction {
  type: "setEntityDirection";
  entityId: string;
  direction: Direction;
}

export function setEntityDirection(state: GameMap, action: SetEntityDirectionReducerAction): GameMap {
  const entity = state.getEntityById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], state.matrix, -1);
    entity.setDirection(action.direction);
    state.setGridMatrixOccupancy([entity], state.matrix, 1);

    return { ...state };
  }

  return state;
}
