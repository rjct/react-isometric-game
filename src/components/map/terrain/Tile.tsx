import React, { memo } from "react";

import { constants } from "../../../constants";

export const Tile = memo(function Tile(props: {
  tile: TileProps;
  isActive: boolean;
  isOccupied: boolean;
  value?: TileProps["value"];
  direction?: TileProps["direction"];
  style?: TileProps["style"];
}) {
  const [tile, setTile] = React.useState(props.tile);
  const [active, setActive] = React.useState(props.isActive);
  const [occupied, setOccupied] = React.useState(props.isOccupied);
  const [value, setValue] = React.useState("" as TileProps["value"]);
  const [direction, setDirection] = React.useState(props.direction);
  const [style, setStyle] = React.useState(props.style);

  React.useEffect(() => {
    setTile(props.tile);
  }, [props.tile]);

  React.useEffect(() => {
    setActive(props.isActive);
  }, [props.isActive]);

  React.useEffect(() => {
    setOccupied(props.isOccupied);
  }, [props.isOccupied]);

  React.useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  React.useEffect(() => {
    setDirection(props.direction || null);
  }, [props.direction]);

  React.useEffect(() => {
    setStyle(props.style || null);
  }, [props.style]);

  return (
    <div
      style={{
        width: tile.size.screen.width,
        height: tile.size.screen.height,
        left: tile.position.screen.x,
        top: tile.position.screen.y,
      }}
      className={[
        tile.className,
        active ? constants.tile.CLASS_ACTIVE : "",
        occupied ? constants.tile.CLASS_OCCUPIED : "",
        direction ? `direction-${direction}` : "",
        style ? style : "",
      ]
        .filter(Boolean)
        .join(" ")}
      id={tile.id}
      key={tile.id}
    >
      {value ? (
        <div>
          <>{value}</>
        </div>
      ) : null}
    </div>
  );
});
