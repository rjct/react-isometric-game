import React from "react";

import { useGameState } from "../../../hooks/useGameState";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { Canvas } from "../../_shared/Canvas";

export const FogOfWar = React.memo(() => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { gameState, uiState, uiDispatch } = useGameState();
  const { renderFogOfWar } = useFogOfWar(gameState, uiDispatch);

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      renderFogOfWar(ctx);
    }
  }, [gameState.getFogOfWarMatrixHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  return gameState.mapSize.width === 0 ||
    uiState.scene === "editor" ||
    !gameState.settings.featureEnabled.fogOfWar ? null : (
    <Canvas size={gameState.mapSize} className={"fow"} ref={canvasRef} />
  );
});
