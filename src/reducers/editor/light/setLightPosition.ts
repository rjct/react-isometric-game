import { GameMap } from "../../../engine/GameMap";

export interface SetLightPositionReducerAction {
  type: "setLightPosition";
  entityId: string;
  coordinates: Coordinates;
}

export function setLightPosition(state: GameMap, action: SetLightPositionReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    light.setPosition(action.coordinates);
    light.setRadius(light.radius);
    light.castRays(state.buildings);

    return { ...state };
  }

  return state;
}
