import { constants } from "@src/engine/constants";
import { getCss3dPosition } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const WireframeMarker = React.memo(
  (props: { coordinates: GridCoordinates; className: string[]; value?: string; onAnimationComplete: () => void }) => {
    const { checkCurrentScene } = useScene();
    const { gameState } = useGameState();

    const marker = React.useMemo(() => {
      const defaultMarker = { size: { width: 1, height: 1, length: 1 }, position: props.coordinates };

      if (props.coordinates.x < 0 || props.coordinates.y < 0) {
        return defaultMarker;
      }

      const entity = gameState.getEntityByCoordinates(props.coordinates);

      return entity
        ? {
            size: entity.size.grid,
            position: entity.getRoundedPosition(),
          }
        : defaultMarker;
    }, [props.coordinates]);

    if (props.coordinates.x < 0 || props.coordinates.y < 0 || !checkCurrentScene(["game", "combat"])) return null;

    return (
      <div
        className={["wireframe-marker", ...props.className].join(" ")}
        style={{
          transform: getCss3dPosition(marker.position),
          width: marker.size.width * constants.wireframeTileSize.width,
          height: marker.size.length * constants.wireframeTileSize.height,
        }}
        onAnimationEnd={props.onAnimationComplete}
      >
        <div className={"wireframe-marker-inner"}>{props.value ? <span>{props.value}</span> : null}</div>
      </div>
    );
  },
);
