import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

import { DebugStartCombatButton } from "@src/components/debug/DebugStartCombatButton";
import { GameDebugFeature, GameSettingsFeature } from "@src/engine/constants";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch } = useGameState();

  if (!gameState.debug.enabled) return null;

  const handleSettingFeatureSwitch = (e: React.ChangeEvent<HTMLInputElement>, featureName: GameSettingsFeature) => {
    gameDispatch({
      type: "toggleFeature",
      featureName,
      featureEnabled: e.target.checked,
    });
  };

  const handleDebugFeatureSwitch = (e: React.ChangeEvent<HTMLInputElement>, featureName: GameDebugFeature) => {
    gameDispatch({
      type: "toggleDebugFeature",
      featureName,
      featureEnabled: e.target.checked,
    });
  };

  return (
    <div className={"debug-features"}>
      <DebugStartCombatButton />

      <hr />

      {Object.entries(gameState.settings.featureEnabled).map(([key, value]) => {
        return (
          <Switch
            key={key}
            title={key}
            checked={value}
            onChange={(e) => handleSettingFeatureSwitch(e, key as GameSettingsFeature)}
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
            onChange={(e) => handleDebugFeatureSwitch(e, key as GameDebugFeature)}
          />
        );
      })}
    </div>
  );
});
