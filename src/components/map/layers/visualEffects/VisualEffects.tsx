import { constants } from "@src/engine/constants";
import { gridToScreenSpace, randomInt } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const VisualEffects = React.memo(() => {
  const { gameState } = useGameState();

  return (
    <>
      {gameState.visualEffects.map((vfx) => {
        const position = gridToScreenSpace(vfx.position, gameState.mapSize);

        return (
          <div
            key={vfx.id}
            className={`vfx-${vfx.type}`}
            style={{
              left: position.x + constants.tileSize.width / 2,
              top: position.y + constants.tileSize.height / 2,
              ...{ ...vfx.getElementCss() },
              scale: 1 + randomInt(-100, 100) / 100,
            }}
          ></div>
        );
      })}
    </>
  );
});
