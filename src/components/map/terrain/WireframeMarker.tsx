import { constants } from "@src/constants";
import { getCss3dPosition } from "@src/engine/helpers";
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
          transform: getCss3dPosition(props.coordinates),
          width: constants.wireframeTileSize.width,
          height: constants.wireframeTileSize.height,
        }}
        onAnimationEnd={props.onAnimationComplete}
      >
        <div className={"wireframe-marker-inner"}>{props.value ? <span>{props.value}</span> : null}</div>
      </div>
    );
  },
);
