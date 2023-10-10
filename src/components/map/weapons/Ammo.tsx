import { MapLayer } from "@src/components/map/MapLayer";
import { SingleUnitAmmo } from "@src/components/map/weapons/SingleUnitAmmo";
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
