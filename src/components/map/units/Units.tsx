import React from "react";
import { UnitComponent } from "./Unit";
import { useGameState } from "../../../hooks/useGameState";

export function Units() {
  const { gameState } = useGameState();

  return (
    <>
      {Object.keys(gameState.units).map((unitId) => (
        <UnitComponent key={unitId} unit={gameState.units[unitId]} />
      ))}
    </>
  );
}
