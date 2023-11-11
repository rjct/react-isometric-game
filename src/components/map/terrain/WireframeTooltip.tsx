import { gridToScreenSpace } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const WireframeTooltip = (props: {
  coordinates: GridCoordinates;
  className: string[];
  value?: React.ReactElement | null;
}) => {
  const { gameState } = useGameState();
  const { hero } = useHero();

  const [className, setClassName] = React.useState(["wireframe-tooltip", ...props.className]);

  if (hero.isBusy() || !props.value) return null;

  const position = gridToScreenSpace(props.coordinates, gameState.mapSize);
  const transform = `translate3d(${position.x}px, ${position.y}px, 0)`;

  return (
    <div
      className={className.join(" ")}
      style={{
        transform,
      }}
      onAnimationEnd={() => setClassName([...className, ...["wireframe-tooltip-bounce"]])}
    >
      {props.value}
    </div>
  );
};
