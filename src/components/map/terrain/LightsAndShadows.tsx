import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useCanvas } from "../../../hooks/useCanvas";
import { useLightsAndShadows } from "../../../hooks/useLightsAndShadows";

export const LightsAndShadows = React.memo(() => {
  const { gameState, uiState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { clearCanvas } = useCanvas();
  const { renderLightsAndShadows } = useLightsAndShadows(gameState);

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext("2d")!;

    clearCanvas(ctx);

    if (uiState.scene === "game" || (uiState.scene === "editor" && uiState.editorMode === "lights")) {
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

  return <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />;
});
