import { GameMap } from "@src/engine/gameMap";
import { getDirectionAngleFromString } from "@src/engine/helpers";

export interface SetUnitDirectionReducerAction {
  type: "setUnitDirection";
  entityId: string;
  direction: Direction;
}

export function setUnitDirection(state: GameMap, action: SetUnitDirectionReducerAction): GameMap {
  const entity = state.getUnitById(action.entityId);

  if (entity) {
    const angle = getDirectionAngleFromString(action.direction);

    entity.setDirection(angle);

    return { ...state };
  }

  return state;
}
