import { constants } from "@src/constants";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export type MapLayerProps = {
  isometric?: boolean;
  additionalEditorSpace?: boolean;
  //
  size: Size2D;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onMouseMove?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function MapLayer({ isometric = true, additionalEditorSpace = false, ...props }: MapLayerProps) {
  const { uiState } = useGameState();

  const tileWidth = isometric ? constants.wireframeTileSize.width : constants.tileSize.width;
  const tileHeight = isometric ? constants.wireframeTileSize.height : constants.tileSize.height;

  const width = props.size.width * tileWidth + (additionalEditorSpace ? constants.editor.propsEditor.width : 0);
  const height = props.size.width * tileHeight;
  const left =
    (isometric ? (props.size.width * constants.tileSize.width) / 2 : 0) +
    (uiState.scene === "editor" && (uiState.editorMode === "units" || uiState.editorMode === "buildings")
      ? constants.editor.entitiesLibrary.width
      : 0);

  const style: React.CSSProperties = { width, height, left, ...props.style };

  return (
    <div
      data-isometric={isometric || null}
      className={`${props.className}${isometric ? " isometric" : ""}`}
      style={style}
      onMouseMove={props.onMouseMove}
      onClick={props.onClick}
      onMouseUp={props.onMouseUp}
      onContextMenu={props.onContextMenu}
    >
      {props.children}
    </div>
  );
}
