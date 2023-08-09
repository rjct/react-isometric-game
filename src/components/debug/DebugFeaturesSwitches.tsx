import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Switch } from "../ui/Switch";

import { GameSettingsFeature } from "../../constants";
import { GameMap } from "../../engine/GameMap";
import { Button } from "../ui/Button";

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
