import { gridToScreenSpace } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const VisualEffects = React.memo(() => {
  const { fxState, fxDispatch, gameState } = useGameState();

  return (
    <>
      {fxState.effects.map((fx) => {
        const position = gridToScreenSpace(fx.position, gameState.mapSize);

        return (
          <div
            key={fx.id}
            className={`fx-${fx.type}`}
            style={{
              left: position.x,
              top: position.y,
              zIndex: Math.ceil(fx.position.x + 1) + Math.ceil(fx.position.y + 1) + 1,
            }}
            onAnimationEnd={() => {
              fxDispatch({ type: "deleteFx", id: fx.id });
            }}
          ></div>
        );
      })}
    </>
  );
});
