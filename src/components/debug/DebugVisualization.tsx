import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { useDebugVisualization } from "../../hooks/debug/useDebugVisualization";
import { Canvas } from "../_shared/Canvas";
import { GameScene } from "../../context/GameUIContext";

export function DebugVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderDebugVisualization } = useDebugVisualization({ canvasRef });

  React.useEffect(() => {
    renderDebugVisualization();
  }, [
    //
    gameState.debug.enabled
      ? [
          gameState.getAllAliveUnitsHash(),
          gameState.getLightsHash(),
          gameState.getMatrixHash(),
          JSON.stringify(gameState.debug),
        ]
      : false,
  ]);

  return gameState.debug.enabled && (["game", "combat", "editor"] as GameScene[]).includes(uiState.scene) ? (
    <Canvas size={gameState.mapSize} className={"debug-visualization"} ref={canvasRef} />
  ) : null;
}
