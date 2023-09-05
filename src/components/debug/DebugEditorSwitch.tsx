import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const DebugEditorSwitch = React.memo(() => {
  const { uiState, gameDispatch, uiDispatch } = useGameState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scene = e.target.checked ? "editor" : "game";

    uiDispatch({ type: "setScene", scene });

    if (scene === "game") {
      gameDispatch({ type: "recalculateLightsAndShadows" });
    }
  };

  return <Switch title={"Editor"} checked={uiState.scene === "editor"} onChange={handleChange} />;
});
