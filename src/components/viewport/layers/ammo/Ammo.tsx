import { SingleUnitAmmo } from "@src/components/viewport/layers/ammo/SingleUnitAmmo";
import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { useGameState } from "@src/hooks/useGameState";

export const Ammo = () => {
  const { gameState } = useGameState();

  return (
    <GameLayer size={gameState.mapSize} className={"ammo-layer"} isometric={false}>
      {Object.values(gameState.ammoFiredIds).map((ammoId) => (
        <SingleUnitAmmo key={ammoId} ammo={gameState.getAmmoById(ammoId)} />
      ))}
    </GameLayer>
  );
};
