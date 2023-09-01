import { Canvas } from "@src/components/_shared/Canvas";
import { GameScene } from "@src/context/GameUIContext";
import { useDebugVisualization } from "@src/hooks/debug/useDebugVisualization";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

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
