import { GameMap } from "@src/engine/gameMap";
import { getDirectionInDegFromString } from "@src/engine/helpers";

export interface SetUnitDirectionReducerAction {
  type: "setUnitDirection";
  entityId: string;
  direction: Direction;
}

export function setUnitDirection(state: GameMap, action: SetUnitDirectionReducerAction): GameMap {
  const entity = state.getUnitById(action.entityId);

  if (entity) {
    const angle = getDirectionInDegFromString(action.direction);

    entity.setDirection(angle);

    return { ...state };
  }

  return state;
}
