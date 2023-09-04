import { UnitComponent } from "@src/components/map/units/Unit";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const Units = React.memo(function Units() {
  const { gameState } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["game", "combat"])) return null;

  return (
    <>
      {Object.keys(gameState.units).map((unitId) => (
        <UnitComponent key={unitId} unit={gameState.units[unitId]} />
      ))}
    </>
  );
});
