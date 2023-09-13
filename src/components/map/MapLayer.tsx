import { constants } from "@src/constants";
import { gridToScreesSize } from "@src/engine/helpers";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export type MapLayerProps = {
  isometric?: boolean;
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

export function MapLayer({ isometric = true, ...props }: MapLayerProps) {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { getEditorLibraryPosition } = useEditor();

  if (!checkCurrentScene(["game", "combat", "editor"]) || gameState.mapSize.width === 0) return null;

  const left = (isometric ? (props.size.width * constants.tileSize.width) / 2 : 0) + getEditorLibraryPosition();

  const style: React.CSSProperties = {
    left: left - uiState.scroll.x,
    top: (uiState.rect.top || 0) - uiState.scroll.y,
    ...gridToScreesSize(props.size),
    ...props.style,
  };

  return (
    <div
      data-isometric={isometric || null}
      className={`map-layer ${props.className}${isometric ? " isometric" : ""}`}
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
