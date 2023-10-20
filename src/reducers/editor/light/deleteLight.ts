import { GameMap } from "@src/engine/gameMap";

export interface DeleteLightReducerAction {
  type: "deleteLight";
  entityId: string;
}

export function deleteLight(state: GameMap, action: DeleteLightReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    state.deleteLight(action.entityId);

    return { ...state };
  }

  return state;
}
