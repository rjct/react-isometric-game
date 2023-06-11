import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { useDebugVisualization } from "../../hooks/debug/useDebugVisualization";
import { Canvas } from "../_shared/Canvas";
import { useHash } from "../../hooks/useHash";

export function DebugVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { matrixHash, lightsHash, allAliveUnitsHash } = useHash();
  const { renderDebugVisualization } = useDebugVisualization({ canvasRef });

  React.useEffect(() => {
    renderDebugVisualization();
  }, [
    //
    gameState.debug.enabled ? [allAliveUnitsHash, lightsHash, matrixHash, JSON.stringify(gameState.debug)] : false,
  ]);

  return gameState.debug.enabled && (uiState.scene === "game" || uiState.scene === "editor") ? (
    <Canvas size={gameState.mapSize} className={"debug-visualization"} ref={canvasRef} />
  ) : null;
}
