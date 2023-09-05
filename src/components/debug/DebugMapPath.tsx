import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const DebugMapPath = React.memo(() => {
  const { gameState } = useGameState();

  return (
    <>
      <legend>{gameState.mapUrl}</legend>
      <legend className={"short"}>{gameState.mapUrl.split("/")[1].split(".")[0]}</legend>
    </>
  );
});
