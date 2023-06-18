import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { BuildingComponent } from "./Building";

export const Buildings = React.memo(function Buildings() {
  const { gameState, uiState } = useGameState();

  return uiState.scene === "game" ? (
    <>
      {gameState.buildings
        .filter((building) => gameState.isEntityInViewport(building, uiState.viewport))
        .map((building) => (
          <BuildingComponent key={building.id} building={building} />
        ))}
    </>
  ) : null;
});
