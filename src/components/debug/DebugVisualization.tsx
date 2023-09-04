import { Canvas } from "@src/components/_shared/Canvas";
import { useDebugVisualization } from "@src/hooks/debug/useDebugVisualization";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export function DebugVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { renderDebugVisualization } = useDebugVisualization({ canvasRef });

  React.useEffect(() => {
    renderDebugVisualization();
  }, [
    gameState.debug.enabled
      ? [
          gameState.getAllAliveUnitsHash(),
          gameState.getLightsHash(),
          gameState.getMatrixHash(),
          JSON.stringify(gameState.debug),
        ]
      : false,
  ]);

  return gameState.debug.enabled && checkCurrentScene(["game", "combat", "editor"]) ? (
    <Canvas size={gameState.mapSize} className={"debug-visualization"} ref={canvasRef} />
  ) : null;
}
