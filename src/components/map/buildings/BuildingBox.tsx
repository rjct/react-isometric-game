import { Building } from "../../../engine/BuildingFactory";
import React, { CSSProperties } from "react";
import { constants } from "../../../constants";

export const BuildingBox = React.memo(function Building(props: {
  building: Building;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Building) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  maskImage: CSSProperties["WebkitMaskImage"];
}) {
  const createWalls = () => {
    const width = props.building.size.grid.width;
    const length = props.building.size.grid.length;
    const height = props.building.size.grid.height;

    const tileWidth = constants.wireframeTileSize.width;
    const tileHeight = constants.wireframeTileSize.height;

    const walls = [];

    const x = props.building.position.x * tileWidth;
    const y = props.building.position.y * tileHeight;

    for (let i = 0; i < props.building.size.grid.width; i++) {
      walls.push(
        <div
          key={`front-${i}`}
          className={"building-wall front"}
          style={{
            width: tileWidth,
            height: height * tileHeight,
            left: x + i * tileWidth,
            top: y + length * tileWidth,
            zIndex: props.building.position.x + props.building.position.y + length + i,
          }}
        ></div>,
      );

      // walls.push(
      //   <div
      //     className={"building-wall back"}
      //     style={{
      //       width: tileWidth,
      //       height: height * tileHeight,
      //       left: x + i * tileWidth,
      //       top: y,
      //       zIndex: props.building.position.x + props.building.position.y + i,
      //     }}
      //   ></div>,
      // );
    }

    for (let i = 0; i < props.building.size.grid.length; i++) {
      // walls.push(
      //   <div
      //     className={"building-wall left"}
      //     style={{
      //       width: height * tileHeight,
      //       height: tileHeight,
      //       left: x,
      //       top: y + i * tileHeight,
      //       zIndex: props.building.position.x + props.building.position.y + i,
      //     }}
      //   ></div>,
      // );

      walls.push(
        <div
          key={`right-${i}`}
          className={"building-wall right"}
          style={{
            width: height * tileHeight,
            height: tileHeight,
            left: x + width * tileWidth,
            top: y + i * tileHeight,
            zIndex: props.building.position.x + props.building.position.y + width + i,
          }}
        ></div>,
      );
    }

    walls.push(
      <div
        key={`top-${props.building.id}`}
        className={"building-wall top"}
        style={{
          width: props.building.size.grid.width * tileHeight,
          height: props.building.size.grid.length * tileHeight,
          left: x,
          top: y,
          zIndex: props.building.position.x + props.building.position.y + width,
          transform: `translateZ(${height * tileHeight}px)`,
        }}
      ></div>,
    );

    return walls;
  };

  return <>{createWalls()}</>;
});
