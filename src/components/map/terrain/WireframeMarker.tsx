import React from "react";
import { constants } from "../../../constants";

export const WireframeMarker = React.memo(
  (props: { coordinates: GridCoordinates; className: string[]; onAnimationComplete: () => void }) => {
    if (!props.coordinates) return null;

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
      ></div>
    );
  }
);
