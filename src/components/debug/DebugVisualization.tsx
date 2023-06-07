import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { useDebugVisualization } from "../../hooks/debug/useDebugVisualization";
import { Canvas } from "../_shared/Canvas";

export function DebugVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderDebugVisualization } = useDebugVisualization({ canvasRef });

  React.useEffect(() => {
    renderDebugVisualization();
  }, [
    //
    JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.position)),
    JSON.stringify(gameState.lights),
    JSON.stringify(gameState.matrix),
    JSON.stringify(gameState.debug),
  ]);

  return gameState.debug.enabled && (uiState.scene === "game" || uiState.scene === "editor") ? (
    <Canvas size={gameState.mapSize} className={"debug-visualization"} ref={canvasRef} />
  ) : null;
}
