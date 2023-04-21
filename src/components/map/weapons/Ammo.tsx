import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";

export const Ammo = React.memo(function Ammo(props: { unit: Unit }) {
  const { gameState } = useGameState();

  return (
    <>
      {props.unit.firedAmmoQueue
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
  );
});
