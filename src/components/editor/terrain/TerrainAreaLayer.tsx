import { TerrainArea } from "@src/engine/TerrainAreaFactory";
import React from "react";

export const TerrainAreaLayer = React.forwardRef(
  (
    props: {
      terrainArea: TerrainArea;
      selected: boolean;
      onClick(e: React.MouseEvent<HTMLAnchorElement>, terrainArea: TerrainArea): void;
    },
    ref: React.ForwardedRef<HTMLLIElement>,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      props.onClick(e, props.terrainArea);
    };

    return (
      <li ref={ref} className={["terrain-area-layer", [props.selected ? "selected" : ""]].join(" ")}>
        <a href="#" onClick={handleClick}>
          [{props.terrainArea.target.x2 - props.terrainArea.target.x1}x
          {props.terrainArea.target.y2 - props.terrainArea.target.y1}] {props.terrainArea.id}
        </a>
      </li>
    );
  },
);
