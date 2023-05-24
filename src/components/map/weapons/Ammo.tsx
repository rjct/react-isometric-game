import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";
import { Firearm } from "../../../engine/weapon/firearm/FirearmFactory";

export const Ammo = React.memo(function Ammo(props: { weapon: null | Firearm }) {
  const { gameState } = useGameState();

  return props.weapon ? (
    <>
      {props.weapon.firedAmmoQueue
        .filter((ammo) => !ammo.isTargetReached)
        .map((ammo) => {
          const position = gameState.gridToScreenSpace(ammo.position);

          return (
            <div
              key={ammo.id}
              className={ammo.className.join(" ")}
              style={{
                width: ammo.size.screen.width,
                height: ammo.size.screen.height,
                left: position.x + constants.tileSize.width / 2,
                top: position.y + constants.tileSize.height / 2,
                transform: `rotateX(60deg) rotateZ(${ammo.angle.deg - 45}deg) translateZ(40px)`,
              }}
            ></div>
          );
        })}
    </>
  ) : null;
});
