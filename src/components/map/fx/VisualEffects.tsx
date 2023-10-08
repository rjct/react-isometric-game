import { MapLayer } from "@src/components/map/MapLayer";
import { EffectType } from "@src/context/GameFxContext";
import { gridToScreenSpace, randomInt } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const VisualEffects = React.memo(() => {
  const { fxState, fxDispatch, gameState, uiState } = useGameState();

  const handleClick = () => {
    if (uiState.mousePosition.isOutOfGrid) return;

    const list: Array<EffectType> = ["explosion", "fire-explosion"];
    const randomEffectType = list.at(randomInt(0, list.length - 1))!;

    fxDispatch({ type: "addFx", coordinates: uiState.mousePosition.grid, effectType: randomEffectType });
  };

  return (
    <MapLayer
      isometric={false}
      size={gameState.mapSize}
      className={"fx-layer"}
      onClick={handleClick}
      style={{
        //pointerEvents: "all",
        zIndex: 2,
      }}
    >
      {fxState.effects.map((fx) => {
        const position = gridToScreenSpace(fx.position, gameState.mapSize);

        return (
          <div
            key={fx.id}
            className={`fx-${fx.type}`}
            style={{
              left: position.x,
              top: position.y,
            }}
            onAnimationEnd={() => {
              fxDispatch({ type: "deleteFx", id: fx.id });
            }}
          ></div>
        );
      })}
    </MapLayer>
  );
});
