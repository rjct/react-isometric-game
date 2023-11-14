import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const DebugSwitch = React.memo(() => {
  const { gameState, gameDispatch } = useGameState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gameDispatch({ type: "toggleDebug", debugEnabled: e.target.checked });
  };

  return <Switch title={"Debug mode"} checked={gameState.debug.enabled} onChange={handleChange} />;
});
