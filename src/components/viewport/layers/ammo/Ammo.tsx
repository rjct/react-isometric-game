import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { SingleUnitAmmo } from "@src/components/viewport/layers/ammo/SingleUnitAmmo";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const Ammo = React.memo(() => {
  const { gameState } = useGameState();

  const ammoFiredIds = React.useMemo(() => {
    return gameState.ammoFiredIds;
  }, [gameState.ammoFiredIds.length]);

  return (
    <GameLayer size={gameState.mapSize} className={"ammo-layer"} isometric={false}>
      {Object.values(ammoFiredIds).map((ammoId) => (
        <SingleUnitAmmo key={ammoId} ammoId={ammoId} />
      ))}
    </GameLayer>
  );
});
