import { constants } from "@src/constants";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const IsometricCanvasMapLayer = React.forwardRef(
  (
    props: {
      className: string;
    },
    ref: React.ForwardedRef<HTMLCanvasElement>,
  ) => {
    const { uiState } = useGameState();
    const { checkCurrentScene } = useScene();
    const { checkEditorMode } = useEditor();

    const width = uiState.viewport.x2 - uiState.viewport.x1;
    const height = uiState.viewport.y2 - uiState.viewport.y1;

    const top = uiState.rect.top;
    const left =
      checkCurrentScene(["editor"]) && checkEditorMode(["buildings", "units"])
        ? constants.editor.entitiesLibrary.width + constants.editor.entitiesLibrary.left
        : 0;

    return (
      <div
        className={props.className}
        style={{
          left: left,
          top: top,
          height: height,
        }}
      >
        <canvas ref={ref} width={width} height={height} />
      </div>
    );
  },
);