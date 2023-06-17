import { GameMap } from "../../../engine/GameMap";
import { GameSettingsFeature } from "../../../constants";

export type ToggleFeatureReducerAction = {
  type: "toggleFeature";
  featureName: GameSettingsFeature;
  featureEnabled: boolean;
};

export function toggleFeature(state: GameMap, action: ToggleFeatureReducerAction): GameMap {
  state.settings.featureEnabled[action.featureName] = action.featureEnabled;

  return { ...state };
}
