import { constants } from "@src/engine/constants";
import { Ammo } from "@src/engine/weapon/AmmoFactory";

export const SingleUnitAmmo = (props: { ammo?: Ammo }) => {
  if (!props.ammo) return null;

  const position = props.ammo.position;

  return (
    <div
      className={`ammo ammo_${props.ammo.name}`}
      style={{
        left: position.screen.x + constants.tileSize.width / 2,
        top: position.screen.y + constants.tileSize.height / 2,
        transform: `rotateX(60deg) rotateZ(${props.ammo.angle.deg - 45}deg) translateZ(40px)`,
      }}
    ></div>
  );
};
