import { SingleUnitAmmo } from "@src/components/map/layers/ammo/SingleUnitAmmo";
import { MapLayer } from "@src/components/map/_shared/MapLayer";
import { useGameState } from "@src/hooks/useGameState";

export const Ammo = () => {
  const { gameState } = useGameState();

  return (
    <MapLayer size={gameState.mapSize} className={"ammo-layer"} isometric={false}>
      {Object.values(gameState.ammoFiredIds).map((ammoId) => (
        <SingleUnitAmmo key={ammoId} ammo={gameState.getAmmoById(ammoId)} />
      ))}
    </MapLayer>
  );
};
