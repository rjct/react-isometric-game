import { GameMap } from "../../../engine/GameMap";
import { GameDebugFeature } from "../../../constants";

export type ToggleDebugFeatureReducerAction = {
  type: "toggleDebugFeature";
  featureName: GameDebugFeature;
  featureEnabled: boolean;
};

export function toggleDebugFeature(state: GameMap, action: ToggleDebugFeatureReducerAction): GameMap {
  state.debug.featureEnabled[action.featureName] = action.featureEnabled;

  return { ...state };
}
