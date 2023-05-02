import React from "react";
import { BuildingComponent } from "./Building";
import { useGameState } from "../../../hooks/useGameState";

export const Buildings = React.memo(function Buildings() {
  const { gameState } = useGameState();

  return (
    <>
      {gameState.buildings.map((building) => (
        <BuildingComponent key={building.id} building={building} />
      ))}
    </>
  );
});
