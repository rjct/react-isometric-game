import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const IsometricCanvasMapLayer = React.forwardRef(
  (
    props: {
      className: string;
    },
    ref: React.ForwardedRef<HTMLCanvasElement>,
  ) => {
    const { uiState } = useGameState();

    const width = uiState.viewport.screen.x2 - uiState.viewport.screen.x1;
    const height = uiState.viewport.screen.y2 - uiState.viewport.screen.y1;

    const top = uiState.rect.top;

    return (
      <div
        className={props.className}
        style={{
          top: top,
          height: height,
        }}
      >
        <canvas ref={ref} width={width} height={height} />
      </div>
    );
  },
);
