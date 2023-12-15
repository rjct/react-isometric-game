import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";
import { useMap } from "@src/hooks/useMap";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const MiniMap = React.memo(function MiniMap() {
  const { gameState, uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();
  const { renderMiniMap } = useMap(gameState);

  const miniMapContainerRef = React.createRef<HTMLDivElement>();
  const miniMapCanvasRef = React.createRef<HTMLCanvasElement>();

  React.useEffect(() => {
    const ctx = miniMapCanvasRef.current?.getContext("2d");

    if (ctx) {
      renderMiniMap(ctx, constants.miniMap.ZOOM);
    }
  }, [gameState.getAllAliveUnitsHash(), uiState.scene, gameState.settings.featureEnabled.fogOfWar]);

  if (!checkCurrentScene(["game"])) return null;

  const handleMiniMapClick = () => {
    uiDispatch({ type: "setScene", scene: "map" });
  };

  return (
    <div ref={miniMapContainerRef} className={`map mini-map`} onClick={handleMiniMapClick}>
      <div className={"overlay"}></div>
      <div className={"noise"}></div>
      <canvas ref={miniMapCanvasRef} {...constants.miniMap.size}></canvas>
    </div>
  );
});
