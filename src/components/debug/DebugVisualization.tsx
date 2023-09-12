import { IsometricCanvasMapLayer } from "@src/components/map/IsometricCanvasMapLayer";
import { constants } from "@src/constants";
import { useDebugVisualization } from "@src/hooks/debug/useDebugVisualization";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";
import { useDebounce } from "use-debounce";

export function DebugVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { renderDebugVisualization } = useDebugVisualization();

  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [hash, setHash] = React.useState<Array<string>>([]);
  const [debouncedHash] = useDebounce(hash, constants.FPS);

  React.useEffect(() => {
    setCtx(canvasRef.current ? canvasRef.current.getContext("2d") : null);
  }, [JSON.stringify(gameState.debug), uiState.scene]);

  React.useEffect(() => {
    if (!ctx || !gameState.debug.enabled) return;

    renderDebugVisualization(ctx);
  }, [debouncedHash, uiState.scroll]);

  React.useEffect(() => {
    setHash([
      gameState.getAllAliveUnitsHash(),
      gameState.getLightsHash(),
      gameState.getMatrixHash(),
      JSON.stringify(gameState.debug),
    ]);
  }, [
    gameState.getAllAliveUnitsHash(),
    gameState.getLightsHash(),
    gameState.getMatrixHash(),
    JSON.stringify(gameState.debug),
  ]);

  if (!gameState.debug.enabled || !checkCurrentScene(["game", "combat", "editor"])) {
    return null;
  }

  return <IsometricCanvasMapLayer ref={canvasRef} className={"debug-visualization"} />;
}
