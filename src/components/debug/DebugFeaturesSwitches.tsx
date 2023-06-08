import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Switch } from "../ui/Switch";
import { GameMap } from "../../engine/GameMap";
import { constants } from "../../constants";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return gameState.debug.enabled ? (
    <div
      className={"debug-features"}
      style={{
        bottom:
          uiState.scene === "game" || (uiState.scene === "editor" && uiState.editorMode === "building")
            ? constants.editor.entitiesLibrary.height
            : 0,
      }}
    >
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
