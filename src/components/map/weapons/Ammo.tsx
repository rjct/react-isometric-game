import { constants } from "@src/engine/constants";
import { gridToScreenSpace } from "@src/engine/helpers";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const Ammo = React.memo(function Ammo(props: { weapon: null | Firearm }) {
  const { gameState } = useGameState();

  if (!props.weapon) return null;

  return (
    <>
      {props.weapon.firedAmmoQueue
        .filter((ammo) => !ammo.isTargetReached)
        .map((ammo) => {
          const position = gridToScreenSpace(ammo.position, gameState.mapSize);

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
  );
});
