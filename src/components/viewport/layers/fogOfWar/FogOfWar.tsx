import React from "react";

import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export const FogOfWarComponent = React.memo(() => {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();

  const [fowImageSrc, setFowImageSrc] = React.useState("");

  const isRenderAllowed =
    gameState.fogOfWar && checkCurrentScene(["game", "combat"]) && gameState.settings.featureEnabled.fogOfWar;

  React.useEffect(() => {
    if (!isRenderAllowed) return;

    gameState.fogOfWar.render(gameState.getHero()).then((bg) => {
      setFowImageSrc(bg);
    });
  }, [
    uiState.scene,
    gameState.settings.featureEnabled.fogOfWar ? gameState.getAllAliveUnitsHash(true) : false,
    gameState.settings.featureEnabled.fogOfWar,
  ]);

  if (!isRenderAllowed) return null;

  return (
    <GameLayer size={gameState.mapSize} className={"fow"}>
      <img
        alt={undefined}
        src={fowImageSrc}
        style={{
          width: gameState.mapSize.width * constants.wireframeTileSize.width,
          height: gameState.mapSize.height * constants.wireframeTileSize.height,
        }}
      ></img>
    </GameLayer>
  );
});
