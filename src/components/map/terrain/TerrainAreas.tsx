import { IsometricCanvasMapLayer } from "@src/components/map/IsometricCanvasMapLayer";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import { useTerrainAreas } from "@src/hooks/useTerrainAreas";
import React from "react";

export const TerrainAreas = React.memo(function TerrainAreas() {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { renderTerrainTiles } = useTerrainAreas(gameState, uiState);

  const canvasRef = React.createRef<HTMLCanvasElement>();
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    if (!ctx) return;

    renderTerrainTiles(ctx);
  }, [
    gameState.mapSize,
    gameState.mapUrl,
    checkCurrentScene(["editor"]) ? gameState.getTerrainHash() : false,
    uiState.scene,
    // uiState.scroll,
    uiState.viewport.grid.x1,
    uiState.viewport.grid.y1,
    uiState.viewport.grid.x2,
    uiState.viewport.grid.y2,

    // props.position.x,
    // props.position.y,
    // x,
    // y,
    uiState.editorMode,
  ]);

  React.useEffect(() => {
    setCtx(canvasRef.current ? canvasRef.current.getContext("2d") : null);
  }, []);

  return <IsometricCanvasMapLayer className={"terrain"} ref={canvasRef} />;
});
