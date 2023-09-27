import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import React from "react";

export const TerrainAreaEditor = (props: {
  area: TerrainArea;
  selected: boolean;
  dragging: boolean;
  handleAreaRectMouseDown: (e: React.MouseEvent, area: TerrainArea) => void;
  handleAreaResizerMouseDown: (e: React.MouseEvent, area: TerrainArea) => void;
}) => {
  const { x, y } = props.area.getScreenCoordinates();
  const { width, height } = props.area.getScreenSize();

  return (
    <div
      className="area"
      style={{
        left: x,
        top: y,
      }}
      data-selected={props.selected || null}
      data-dragging={props.dragging || null}
    >
      <div
        className="area-rect"
        style={{
          width: Math.floor(width),
          height: Math.floor(height),
        }}
        onMouseDown={(e) => props.handleAreaRectMouseDown(e, props.area)}
      />
      <div
        className="area-resizer"
        style={{
          left: width - 10,
          top: height - 10,
          width: 20,
          height: 20,
        }}
        onMouseDown={(e) => props.handleAreaResizerMouseDown(e, props.area)}
      />
    </div>
  );
};
