import { MapLayer } from "@src/components/map/MapLayer";
import { SingleUnitAmmo } from "@src/components/map/weapons/SingleUnitAmmo";
import { useGameState } from "@src/hooks/useGameState";

export const Ammo = () => {
  const { gameState } = useGameState();

  return (
    <MapLayer size={gameState.mapSize} className={"ammo-layer"} isometric={false}>
      {Object.values(gameState.weapon)
        .filter((weapon) => weapon.firedAmmoQueue.length > 0)
        .map((weapon) =>
          weapon.firedAmmoQueue
            .filter((ammo) => !ammo.isTargetReached)
            .map((ammo) => <SingleUnitAmmo key={ammo.id} ammo={ammo} />),
        )}
    </MapLayer>
  );
};
