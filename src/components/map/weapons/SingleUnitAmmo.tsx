import { constants } from "@src/engine/constants";
import { gridToScreenSpace } from "@src/engine/helpers";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { useGameState } from "@src/hooks/useGameState";

export const SingleUnitAmmo = (props: { ammo: Ammo }) => {
  const { gameState } = useGameState();

  const position = gridToScreenSpace(props.ammo.position, gameState.mapSize);

  return (
    <div
      className={`ammo ammo_${props.ammo.name}`}
      style={{
        left: position.x + constants.tileSize.width / 2,
        top: position.y + constants.tileSize.height / 2,
        transform: `rotateX(60deg) rotateZ(${props.ammo.angle.deg - 45}deg) translateZ(40px)`,
      }}
    ></div>
  );
};
