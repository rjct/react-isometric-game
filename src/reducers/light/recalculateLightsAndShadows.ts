import { GameMap } from "@src/engine/gameMap";

export type RecalculateLightsAndShadowsReducerAction = {
  type: "recalculateLightsAndShadows";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recalculateLightsAndShadows(state: GameMap, action: RecalculateLightsAndShadowsReducerAction) {
  if (!state.settings.featureEnabled.light && !state.settings.featureEnabled.shadow) return state;

  const walls = state.getAllGameEntitiesWalls();

  state.lights.forEach((light) => {
    light.cast(walls);
  });

  return state;
}
