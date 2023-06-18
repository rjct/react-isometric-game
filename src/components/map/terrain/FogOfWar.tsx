import React from "react";

import { useGameState } from "../../../hooks/useGameState";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { Canvas } from "../../_shared/Canvas";

export const FogOfWar = React.memo(() => {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderFogOfWar } = useFogOfWar({ canvasRef });

  React.useLayoutEffect(() => {
    if (gameState.mapSize.width === 0 || uiState.scene === "editor") return;

    renderFogOfWar();
  }, [gameState.getFogOfWarMatrixHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  return gameState.mapSize.width === 0 ||
    uiState.scene === "editor" ||
    !gameState.settings.featureEnabled.fogOfWar ? null : (
    <Canvas size={gameState.mapSize} className={"fow"} ref={canvasRef} />
  );
});
