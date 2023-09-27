import { GameMap } from "@src/engine/gameMap";

export interface SetLightColorReducerAction {
  type: "setLightColor";
  entityId: string;
  color: string;
}

export function setLightColor(state: GameMap, action: SetLightColorReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    light.setColor(action.color);

    return { ...state };
  }

  return state;
}
