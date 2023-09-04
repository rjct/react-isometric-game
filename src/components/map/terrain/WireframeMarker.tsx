import { constants } from "@src/constants";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const WireframeMarker = React.memo(
  (props: { coordinates: GridCoordinates; className: string[]; value?: string; onAnimationComplete: () => void }) => {
    const { checkCurrentScene } = useScene();

    if (!props.coordinates || !checkCurrentScene(["game", "combat"])) return null;

    return (
      <div
        className={["wireframe-marker", ...props.className].join(" ")}
        style={{
          left: props.coordinates.x * constants.wireframeTileSize.width,
          top: props.coordinates.y * constants.wireframeTileSize.height,
          width: constants.wireframeTileSize.width,
          height: constants.wireframeTileSize.height,
        }}
        onAnimationEnd={props.onAnimationComplete}
      >
        {props.value ? <span>{props.value}</span> : null}
      </div>
    );
  },
);
