import React from "react";
import { Building } from "./Building";
import { useGameState } from "../../../hooks/useGameState";

export const Buildings = React.memo(function Buildings() {
  const { gameState } = useGameState();

  return (
    <>
      {gameState.buildings.map((building) => (
        <Building key={building.id} building={building} />
      ))}
    </>
  );
});
