import React from "react";

import { useGameState } from "../../../hooks/useGameState";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { constants } from "../../../constants";

export const FogOfWar = React.memo(() => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { gameState, uiState } = useGameState();
  const { renderFogOfWar } = useFogOfWar(gameState);

  const [fowImageSrc, setFowImageSrc] = React.useState("");

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      renderFogOfWar(ctx);

      setFowImageSrc(canvasRef.current.toDataURL());
    }
  }, [gameState.getFogOfWarMatrixHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  return gameState.mapSize.width === 0 ||
    uiState.scene === "editor" ||
    !gameState.settings.featureEnabled.fogOfWar ? null : (
    <div
      className={"fow"}
      style={{
        left: (gameState.mapSize.width * constants.tileSize.width) / 2,
      }}
    >
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
        height={gameState.mapSize.width}
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </div>
  );
});
