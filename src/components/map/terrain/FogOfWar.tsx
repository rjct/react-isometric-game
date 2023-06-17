import React from "react";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";

export function FogOfWar() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderFogOfWar } = useFogOfWar({ canvasRef });

  React.useEffect(() => {
    if (uiState.scene === "editor") return;

    renderFogOfWar();
  }, [gameState.getFogOfWarMatrixHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  return uiState.scene === "editor" || !gameState.settings.featureEnabled.fogOfWar ? null : (
    <Canvas size={gameState.mapSize} className={"fow"} ref={canvasRef} />
  );
}
