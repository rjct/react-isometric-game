import React from "react";
import { UnitComponent } from "./Unit";
import { useGameState } from "../../../hooks/useGameState";

export function Units() {
  const { gameState, uiState } = useGameState();

  return uiState.scene === "game" || (uiState.scene === "editor" && uiState.editorMode === "unit") ? (
    <>
      {Object.keys(gameState.units).map((unitId) => (
        <UnitComponent key={unitId} unit={gameState.units[unitId]} />
      ))}
    </>
  ) : null;
}
