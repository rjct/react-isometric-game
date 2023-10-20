import React from "react";

import { MapLayer } from "@src/components/map/MapLayer";
import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export const FogOfWarComponent = React.memo(() => {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();

  const [fowImageSrc, setFowImageSrc] = React.useState("");

  React.useEffect(() => {
    if (!gameState.fogOfWar || !gameState.settings.featureEnabled.fogOfWar) return;

    gameState.fogOfWar.render(gameState.getHero()).then((bg) => {
      setFowImageSrc(bg);
    });
  }, [
    uiState.scene,
    gameState.settings.featureEnabled.fogOfWar ? gameState.getAllAliveUnitsHash() : false,
    gameState.settings.featureEnabled.fogOfWar,
  ]);

  if (!checkCurrentScene(["game", "combat"]) || !gameState.settings.featureEnabled.fogOfWar) return null;

  return (
    <MapLayer size={gameState.mapSize} className={"fow"}>
      <img
        alt={undefined}
        src={fowImageSrc}
        style={{
          width: gameState.mapSize.width * constants.wireframeTileSize.width,
          height: gameState.mapSize.height * constants.wireframeTileSize.height,
        }}
      ></img>
    </MapLayer>
  );
});
