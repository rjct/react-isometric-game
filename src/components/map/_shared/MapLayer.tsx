import { constants } from "@src/engine/constants";
import { gridToScreesSize } from "@src/engine/helpers";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export type MapLayerProps = {
  isometric?: boolean;
  size: Size2D;
  className: string;
  style?: React.CSSProperties;
  dataProps?: { [p: string]: string | boolean | undefined };
  children: React.ReactNode;
  onMouseMove?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseUp?: (e: React.MouseEvent | React.TouchEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function MapLayer({ isometric = true, ...props }: MapLayerProps) {
  const { gameState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { getEditorLibraryPosition } = useEditor();

  if (!checkCurrentScene(["game", "combat", "editor"]) || gameState.mapSize.width === 0) return null;

  const left = (isometric ? (props.size.width * constants.tileSize.width) / 2 : 0) + getEditorLibraryPosition();
  const size = isometric
    ? gridToScreesSize(props.size)
    : {
        width: props.size.width * constants.tileSize.width,
        height: props.size.height * constants.tileSize.height,
      };

  const style: React.CSSProperties = {
    left,
    ...size,
    ...props.style,
  };

  return (
    <div
      data-isometric={isometric || null}
      className={`map-layer ${props.className}${isometric ? " isometric" : ""}`}
      style={style}
      onMouseMove={props.onMouseMove}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onContextMenu={props.onContextMenu}
      {...props.dataProps}
    >
      {props.children}
    </div>
  );
}
