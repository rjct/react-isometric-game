import { GameMap } from "../../../engine/GameMap";

export interface SetLightPositionReducerAction {
  type: "setLightPosition";
  entityId: string;
  coordinates: Coordinates;
}

export function setLightPosition(state: GameMap, action: SetLightPositionReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    light.position = action.coordinates;

    return { ...state };
  }

  return state;
}
