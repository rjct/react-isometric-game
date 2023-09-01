import { MapLayer } from "@src/components/map/MapLayer";
import { constants } from "@src/constants";
import React from "react";

export const Canvas = React.forwardRef(
  (
    props: {
      className: string;
      size: Size2D;
      handleMouseMove?: (e: React.MouseEvent) => void;
      handleClick?: (e: React.MouseEvent) => void;
      handleRightClick?: (e: React.MouseEvent) => void;
    },
    ref: React.ForwardedRef<HTMLCanvasElement>,
  ) => {
    return (
      <MapLayer
        size={props.size}
        className={props.className}
        onMouseMove={props.handleMouseMove}
        onClick={props.handleClick}
        onContextMenu={props.handleRightClick}
      >
        <canvas
          ref={ref}
          width={props.size.width * constants.wireframeTileSize.width}
          height={`${props.size.height * constants.wireframeTileSize.height}`}
        ></canvas>
      </MapLayer>
    );
  },
);
