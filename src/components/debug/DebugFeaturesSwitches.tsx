import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

import { Button } from "@src/components/ui/Button";
import { GameDebugFeature, GameSettingsFeature } from "@src/constants";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();

  if (!gameState.debug.enabled) return null;

  const handleStartCombatButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "combat" });
    gameDispatch({ type: "startCombat" });
  };

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
      <Button
        className={["control-end-combat"]}
        disabled={uiState.scene !== "game"}
        onClick={handleStartCombatButtonClick}
      >
        <label style={{ whiteSpace: "nowrap" }}>start combat</label>
      </Button>

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
