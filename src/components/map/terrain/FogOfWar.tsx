import React from "react";

import { MapLayer } from "@src/components/map/MapLayer";
import { constants } from "@src/constants";
import { useFogOfWar } from "@src/hooks/useFogOfWar";
import { useGameState } from "@src/hooks/useGameState";

export const FogOfWar = React.memo(() => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const { gameState, uiState } = useGameState();
  const { renderFogOfWar } = useFogOfWar(gameState);

  const [fowImageSrc, setFowImageSrc] = React.useState("");

  React.useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    if (ctx) {
      renderFogOfWar(ctx);

      setFowImageSrc(canvasRef.current.toDataURL());
    }
  }, [gameState.getFogOfWarMatrixHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  return gameState.mapSize.width === 0 ||
    uiState.scene === "editor" ||
    !gameState.settings.featureEnabled.fogOfWar ? null : (
    <MapLayer size={gameState.mapSize} className={"fow"}>
      <img
        alt={undefined}
        src={fowImageSrc}
        style={{
          width: gameState.mapSize.width * constants.wireframeTileSize.width,
          height: gameState.mapSize.height * constants.wireframeTileSize.height,
        }}
      ></img>
      <canvas
        width={gameState.mapSize.width}
        height={gameState.mapSize.height}
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </MapLayer>
  );
});
