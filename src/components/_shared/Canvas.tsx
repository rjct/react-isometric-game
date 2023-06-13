import React from "react";
import { constants } from "../../constants";

export const Canvas = React.forwardRef(
  (
    props: {
      className: string;
      size: Size;
      handleMouseMove?: (e: React.MouseEvent) => void;
      handleClick?: (e: React.MouseEvent) => void;
      handleRightClick?: (e: React.MouseEvent) => void;
    },
    ref: React.ForwardedRef<HTMLCanvasElement>
  ) => {
    const wireframeTileWidth = constants.wireframeTileSize.width;
    const wireframeTileHeight = constants.wireframeTileSize.height;

    const tileWidth = constants.tileSize.width;

    return (
      <div
        className={props.className}
        style={{
          width: props.size.width * wireframeTileWidth,
          height: props.size.height * wireframeTileHeight,
          left: (props.size.width * tileWidth) / 2,
        }}
        onMouseMove={props.handleMouseMove}
        onClick={props.handleClick}
        onContextMenu={props.handleRightClick}
      >
        <canvas
          ref={ref}
          width={props.size.width * wireframeTileWidth}
          height={`${props.size.height * wireframeTileHeight}`}
        ></canvas>
      </div>
    );
  }
);
