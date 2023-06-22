import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Switch } from "../ui/Switch";

import { GameSettingsFeature } from "../../constants";
import { GameMap } from "../../engine/GameMap";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch } = useGameState();

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
