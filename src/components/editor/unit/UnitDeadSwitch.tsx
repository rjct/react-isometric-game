import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function UnitDeadSwitch() {
  const { gameState, gameDispatch } = useGameState();

  if (!gameState.selectedUnit) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gameDispatch({
      type: "setUnitDead",
      entityId: gameState.selectedUnit.id,
      isDead: e.target.checked,
    });
  };

  return (
    <Switch
      title={""}
      checked={gameState.selectedUnit.isDead}
      disabled={gameState.selectedUnit.isHero}
      onChange={handleChange}
    />
  );
}
