import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

import { Button } from "@src/components/ui/Button";
import { GameSettingsFeature } from "@src/constants";
import { GameMap } from "@src/engine/GameMap";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();

  return gameState.debug.enabled ? (
    <div className={"debug-features"}>
      <Button
        className={["control-end-combat"]}
        disabled={uiState.scene !== "game"}
        onClick={() => {
          uiDispatch({ type: "setScene", scene: "combat" });
          gameDispatch({ type: "startCombat" });
        }}
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
