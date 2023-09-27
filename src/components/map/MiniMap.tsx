import { constants } from "@src/engine/constants";
import { degToRad } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useMiniMap } from "@src/hooks/useMiniMap";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const MiniMap = React.memo(function MiniMap() {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { renderMiniMap } = useMiniMap(gameState);

  const miniMapContainerRef = React.createRef<HTMLDivElement>();
  const miniMapCanvasRef = React.createRef<HTMLCanvasElement>();

  const canvasWidth = constants.miniMap.size.width * constants.wireframeTileSize.width * constants.miniMap.ZOOM;
  const canvasHeight = constants.miniMap.size.height * constants.wireframeTileSize.height * constants.miniMap.ZOOM;

  const canvasMargin = (Math.sin(degToRad(45)) - 1 / 2) * canvasWidth;

  React.useEffect(() => {
    const ctx = miniMapCanvasRef.current?.getContext("2d");

    if (ctx) {
      renderMiniMap(ctx);
    }
  }, [gameState.getAllAliveUnitsHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  if (!checkCurrentScene(["game"])) return null;

  return (
    <div ref={miniMapContainerRef} className={`mini-map`}>
      <canvas
        ref={miniMapCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          marginLeft: canvasMargin,
          marginRight: canvasMargin,
          marginTop: -canvasMargin / 2,
          marginBottom: -canvasMargin / 2,
        }}
      ></canvas>
    </div>
  );
});
