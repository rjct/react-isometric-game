import { GameMap } from "../../../engine/GameMap";

export interface SetLightRadiusReducerAction {
  type: "setLightRadius";
  entityId: string;
  radius: number;
}

export function setLightRadius(state: GameMap, action: SetLightRadiusReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    light.setRadius(action.radius);
    light.castRays(state.buildings);

    return { ...state };
  }

  return state;
}
