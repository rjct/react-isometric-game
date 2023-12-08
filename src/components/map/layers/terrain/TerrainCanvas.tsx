import { IsometricCanvasMapLayer } from "@src/components/map/_shared/IsometricCanvasMapLayer";
import { GameScene } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import { useTerrainAreas } from "@src/hooks/useTerrainAreas";
import React from "react";

export const TerrainCanvas = React.memo(function TerrainEditor(props: { workingScenes: GameScene[] }) {
  const { terrainState, gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { renderTerrainTiles } = useTerrainAreas(terrainState, gameState, uiState);

  const canvasRef = React.createRef<HTMLCanvasElement>();
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    setCtx(canvasRef.current ? canvasRef.current.getContext("2d") : null);
  }, [uiState.scene, canvasRef]);

  React.useEffect(() => {
    if (!ctx) return;

    renderTerrainTiles(ctx);
  }, [
    gameState.mapSize,
    gameState.mapUrl,
    uiState.scene,
    uiState.scroll,
    uiState.editorMode,
    checkCurrentScene(props.workingScenes) ? terrainState.getTerrainAreasHash() : false,
    checkCurrentScene(props.workingScenes) ? canvasRef : false,
  ]);

  if (!checkCurrentScene(props.workingScenes)) return null;

  return <IsometricCanvasMapLayer className={"terrain"} ref={canvasRef} />;
});
