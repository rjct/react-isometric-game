import { GameDebugFeature } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";

export type ToggleDebugFeatureReducerAction = {
  type: "toggleDebugFeature";
  featureName: GameDebugFeature;
  featureEnabled: boolean;
};

export function toggleDebugFeature(state: GameMap, action: ToggleDebugFeatureReducerAction): GameMap {
  state.debug.featureEnabled[action.featureName] = action.featureEnabled;

  return { ...state };
}
