import { GameMap } from "../../engine/GameMap";

export type RecalculateLightsAndShadowsReducerAction = {
  type: "recalculateLightsAndShadows";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recalculateLightsAndShadows(state: GameMap, action: RecalculateLightsAndShadowsReducerAction) {
  if (!state.settings.featureEnabled.light && !state.settings.featureEnabled.shadow) return state;

  const buildings = state.buildings.filter((building) => building.occupiesCell);

  state.lights.forEach((light) => {
    light.setRadius(light.radius);
    light.castRays(buildings);
  });

  return state;
}
