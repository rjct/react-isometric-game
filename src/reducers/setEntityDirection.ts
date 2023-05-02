import { GameMap } from "../engine/GameMap";

export interface SetEntityDirectionReducerAction {
  type: "setEntityDirection";
  entityId: string;
  direction: Direction;
}

export function setEntityDirection(state: GameMap, action: SetEntityDirectionReducerAction): GameMap {
  const entity = state.getEntityById(action.entityId);

  if (entity) {
    entity.setDirection(action.direction);

    return { ...state };
  }

  return state;
}
