import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const EndCombatButton = React.memo(() => {
  const { gameState, gameDispatch, uiDispatch } = useGameState();
  const { hero } = useHero();
  const { checkCurrentScene } = useScene();

  const handleEndCombatButtonClick = () => {
    gameDispatch({ type: "endCombat" });
    uiDispatch({ type: "setScene", scene: "game" });
  };

  return (
    <Button
      className={["control-end-combat"]}
      disabled={!checkCurrentScene(["combat"]) || gameState.combatQueue.currentUnitId !== hero.id}
      onClick={handleEndCombatButtonClick}
    >
      <label>End Combat</label>
    </Button>
  );
});
