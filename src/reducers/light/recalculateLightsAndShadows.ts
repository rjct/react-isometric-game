import { GameMap } from "../../engine/GameMap";

export type RecalculateLightsAndShadowsReducerAction = {
  type: "recalculateLightsAndShadows";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recalculateLightsAndShadows(state: GameMap, action: RecalculateLightsAndShadowsReducerAction) {
  if (!state.settings.featureEnabled.light && !state.settings.featureEnabled.shadow) return state;

  state.lights.forEach((light) => {
    light.cast(state.getAllGameObjectsWalls());
  });

  return state;
}
