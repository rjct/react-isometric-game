import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useLightsAndShadows } from "../../../hooks/useLightsAndShadows";

export const LightsAndShadows = React.memo(() => {
  const { gameState, uiState, uiDispatch } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { renderLightsAndShadows } = useLightsAndShadows(gameState, uiState, uiDispatch);

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      renderLightsAndShadows(ctx);
    }
  }, [
    gameState.mapSize,
    uiState.scene === "editor" ? gameState.getLightsHash() : false,
    gameState.shadows,
    gameState.settings.featureEnabled.light,
    gameState.settings.featureEnabled.shadow,
    gameState.settings.featureEnabled.unitShadow,
    uiState.scene,
    uiState.editorMode,
  ]);

  return gameState.mapSize.width === 0 ||
    (!gameState.settings.featureEnabled.light && !gameState.settings.featureEnabled.shadow) ? null : (
    <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />
  );
});
