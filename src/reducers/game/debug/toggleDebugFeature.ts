import { GameMap } from "../../../engine/GameMap";

export type ToggleDebugFeatureReducerAction = {
  type: "toggleDebugFeature";
  featureName: keyof GameMap["debug"]["featureEnabled"];
  featureEnabled: boolean;
};

export function toggleDebugFeature(state: GameMap, action: ToggleDebugFeatureReducerAction): GameMap {
  state.debug.featureEnabled[action.featureName] = action.featureEnabled;

  return { ...state };
}
