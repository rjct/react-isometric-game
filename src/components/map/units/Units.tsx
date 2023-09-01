import { UnitComponent } from "@src/components/map/units/Unit";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const Units = React.memo(function Units() {
  const { gameState, uiState } = useGameState();

  return uiState.scene === "game" || uiState.scene === "combat" ? (
    <>
      {Object.keys(gameState.units).map((unitId) => (
        <UnitComponent key={unitId} unit={gameState.units[unitId]} />
      ))}
    </>
  ) : null;
});
