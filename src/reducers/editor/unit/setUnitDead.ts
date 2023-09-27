import { GameMap } from "@src/engine/gameMap";

export interface SetUnitDeadReducerAction {
  type: "setUnitDead";
  entityId: string;
  isDead: boolean;
}

export function setUnitDead(state: GameMap, action: SetUnitDeadReducerAction): GameMap {
  const entity = state.getUnitById(action.entityId);

  if (entity) {
    entity.isDead = action.isDead;
    entity.setAction(action.isDead ? "dead" : "none");

    if (action.isDead) {
      state.deOccupyCell(entity.position);
      entity.clearShadows();
    } else {
      state.occupyCell(entity.position);
      entity.healthPoints.current = entity.healthPoints.max;
      entity.calcShadows(state);
    }

    return { ...state };
  }

  return state;
}
