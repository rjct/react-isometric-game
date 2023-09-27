import { constants, GameDebugFeature, GameFeatureSections, GameSettingsFeature } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";

export const getUrlParamValue = (param: string) => {
  const url = new URL(window.location.href);
  const urlParamValue = url.searchParams.get(param);

  return urlParamValue == null ? null : urlParamValue.toLowerCase() === "true";
};

export function useUrl() {
  const getSettingValue = (
    gameState: GameMap,
    section: GameFeatureSections,
    key: GameSettingsFeature | GameDebugFeature,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentValue = String((gameState[section] as any).featureEnabled[key]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultValue = String((constants.featureEnabled[section] as any)[key]);

    return { currentValue, defaultValue };
  };

  const updateUrlWithFeaturesEnabled = (gameState: GameMap) => {
    if (gameState.mapSize.width === 0) return;

    const url = new URL(window.location.href);

    (["settings", "debug"] as GameFeatureSections[]).forEach((section) => {
      Object.keys(gameState[section].featureEnabled).forEach((key) => {
        const { currentValue, defaultValue } = getSettingValue(gameState, section, key as GameSettingsFeature);

        if (currentValue === defaultValue) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, currentValue);
        }
      });
    });

    window.history.replaceState({}, "", url);
  };

  return { updateUrlWithFeaturesEnabled };
}
