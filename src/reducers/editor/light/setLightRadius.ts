import { GameMap } from "../../../engine/GameMap";

export interface SetLightRadiusReducerAction {
  type: "setLightRadius";
  entityId: string;
  radius: number;
}

export function setLightRadius(state: GameMap, action: SetLightRadiusReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    light.radius = action.radius;

    return { ...state };
  }

  return state;
}
