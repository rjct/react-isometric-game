import { GameMap } from "@src/engine/gameMap";

export interface SetLightPositionReducerAction {
  type: "setLightPosition";
  entityId: string;
  coordinates: GridCoordinates;
}

export function setLightPosition(state: GameMap, action: SetLightPositionReducerAction): GameMap {
  const light = state.getLightById(action.entityId);

  if (light) {
    light.setPosition(action.coordinates);
    light.setRadius(light.radius);

    return { ...state };
  }

  return state;
}
