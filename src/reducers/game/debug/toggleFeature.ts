import { GameSettingsFeature } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";

export type ToggleFeatureReducerAction = {
  type: "toggleFeature";
  featureName: GameSettingsFeature;
  featureEnabled: boolean;
};

export function toggleFeature(state: GameMap, action: ToggleFeatureReducerAction): GameMap {
  state.settings.featureEnabled[action.featureName] = action.featureEnabled;

  return { ...state };
}
