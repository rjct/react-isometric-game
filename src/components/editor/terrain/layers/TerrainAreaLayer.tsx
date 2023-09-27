import { Switch } from "@src/components/ui/Switch";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import React from "react";

export const TerrainAreaLayer = React.forwardRef(
  (
    props: {
      terrainArea: TerrainArea;
      selected: boolean;
      onClick(e: React.MouseEvent<HTMLAnchorElement>, terrainArea: TerrainArea): void;
      onVisibilityChange(terrainArea: TerrainArea, visibility: boolean): void;
    },
    ref: React.ForwardedRef<HTMLLIElement>,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      props.onClick(e, props.terrainArea);
    };

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onVisibilityChange(props.terrainArea, e.target.checked);
    };

    return (
      <li ref={ref} className={["terrain-area-layer", [props.selected ? "selected" : ""]].join(" ")}>
        <Switch
          title={""}
          checked={props.terrainArea.isVisible()}
          disabled={!props.selected}
          onChange={handleVisibilityChange}
        />
        <a href="#" onClick={handleClick}>
          [{props.terrainArea.target.x2 - props.terrainArea.target.x1}x
          {props.terrainArea.target.y2 - props.terrainArea.target.y1}] {props.terrainArea.id}
        </a>
      </li>
    );
  },
);
