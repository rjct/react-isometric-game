import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Switch } from "../ui/Switch";

import { GameSettingsFeature } from "../../constants";
import { GameMap } from "../../engine/GameMap";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();

  return gameState.debug.enabled ? (
    <div className={"debug-features"}>
      {Object.entries(gameState.settings.featureEnabled).map(([key, value]) => {
        return (
          <Switch
            key={key}
            title={key}
            checked={value}
            onChange={(e) => {
              gameDispatch({
                type: "toggleFeature",
                featureName: key as GameSettingsFeature,
                featureEnabled: e.target.checked,
              });

              if (key === "light" || key === "shadow") {
                uiDispatch({
                  type: "updateOffscreenCanvasRenderingProgress",
                  entity: "lightsAndShadows",
                  progress: {
                    ...uiState.offscreenCanvasRenderingProgress.lightsAndShadows,
                    ...{
                      percent: 0,
                      complete: false,
                    },
                  },
                });
              }

              if (key === "fogOfWar") {
                uiDispatch({
                  type: "updateOffscreenCanvasRenderingProgress",
                  entity: "fogOfWar",
                  progress: {
                    ...uiState.offscreenCanvasRenderingProgress.lightsAndShadows,
                    ...{
                      percent: 0,
                      complete: false,
                    },
                  },
                });
              }
            }}
          />
        );
      })}
      <hr />
      {Object.entries(gameState.debug.featureEnabled).map(([key, value]) => {
        return (
          <Switch
            key={key}
            title={key}
            checked={value}
            onChange={(e) => {
              gameDispatch({
                type: "toggleDebugFeature",
                featureName: key as keyof GameMap["debug"]["featureEnabled"],
                featureEnabled: e.target.checked,
              });
            }}
          />
        );
      })}
    </div>
  ) : null;
});
