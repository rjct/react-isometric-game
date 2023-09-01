import { TerrainArea } from "@src/engine/TerrainAreaFactory";
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
    <g className="area" data-selected={props.selected || null} data-dragging={props.dragging || null}>
      <rect
        className="area-rect"
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseDown={(e) => props.handleAreaRectMouseDown(e, props.area)}
      />
      <rect
        className="area-resizer"
        x={x + width - 10}
        y={y + height - 10}
        width="20"
        height="20"
        onMouseDown={(e) => props.handleAreaResizerMouseDown(e, props.area)}
      />
    </g>
  );
};
