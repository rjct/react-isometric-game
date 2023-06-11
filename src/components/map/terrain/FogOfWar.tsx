import React from "react";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useHash } from "../../../hooks/useHash";

export function FogOfWar() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { fogOfWarMatrixHash } = useHash();
  const { renderFogOfWar } = useFogOfWar({ canvasRef });

  React.useEffect(() => {
    if (uiState.scene === "editor") return;

    renderFogOfWar();
  }, [fogOfWarMatrixHash, uiState.scene, gameState.debug.featureEnabled.fogOfWar]);

  return uiState.scene === "editor" || !gameState.debug.featureEnabled.fogOfWar ? null : (
    <Canvas size={gameState.mapSize} className={"fow"} ref={canvasRef} />
  );
}
