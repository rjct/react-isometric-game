import React from "react";
import { UnitComponent } from "./Unit";
import { useGameState } from "../../../hooks/useGameState";

export const Units = React.memo(function Units() {
  const { gameState, uiState } = useGameState();

  return uiState.scene === "game" || uiState.editorMode === "lights" ? (
    <>
      {Object.keys(gameState.units).map((unitId) => (
        <UnitComponent key={unitId} unit={gameState.units[unitId]} />
      ))}
    </>
  ) : null;
});
