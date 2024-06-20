import { gridToScreenSpace } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const WireframeTooltip = React.memo(
  (props: { coordinates: GridCoordinates; className: string[]; value?: string | React.ReactElement | null }) => {
    const { gameState } = useGameState();
    const { hero } = useHero();

    const [className, setClassName] = React.useState([...["wireframe-tooltip", "tooltip-show"], ...props.className]);

    const position = React.useMemo(() => {
      if (props.coordinates.x < 0 || props.coordinates.y < 0) return props.coordinates;

      const entity = gameState.getEntityByCoordinates(props.coordinates);

      if (!entity) return gridToScreenSpace(props.coordinates, gameState.mapSize);

      return gridToScreenSpace(entity.getRoundedCenterPosition(), gameState.mapSize);
    }, [props.coordinates]);

    if (hero.isBusy() || !props.value) return null;

    return (
      <div
        className={className.join(" ")}
        style={{
          left: position.x,
          top: position.y,
        }}
        onAnimationEnd={() => setClassName([...className, ...["wireframe-tooltip-bounce"]])}
      >
        {props.value}
      </div>
    );
  },
);
