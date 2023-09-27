import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const EndTurnButton = React.memo(() => {
  const { gameState, gameDispatch } = useGameState();
  const { hero } = useHero();
  const { checkCurrentScene } = useScene();

  const handleEndTurnButtonClick = () => {
    hero.stop();
    hero.restoreActionPoints();
    gameDispatch({ type: "endTurn" });
  };

  return (
    <Button
      className={["control-end-turn"]}
      disabled={!checkCurrentScene(["combat"]) || gameState.combatQueue.currentUnitId !== hero.id}
      onClick={handleEndTurnButtonClick}
    >
      <label>End Turn</label>
    </Button>
  );
});
