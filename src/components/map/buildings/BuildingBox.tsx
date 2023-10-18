import { Building } from "@src/engine/BuildingFactory";
import { constants } from "@src/engine/constants";
import { getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import React, { CSSProperties } from "react";

export const BuildingBox = React.memo(function Building(props: {
  building: Building;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Building) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  maskImage: CSSProperties["WebkitMaskImage"];
}) {
  const { gameState } = useGameState();

  const getDistance = (position: GridCoordinates, side: "right" | "front") => {
    return Math.max(
      ...gameState.lights.map((light) => {
        const d = getDistanceBetweenGridPoints(position, light.position);

        switch (side) {
          case "front":
            if (light.position.y < position.y) return 0;
            break;

          case "right":
            if (light.position.x <= position.x - 1) return 0;
            break;
        }

        if (d > light.radius) return 0;

        return 50 + 100 - (getDistanceBetweenGridPoints(position, light.position) / light.radius) * 100;
      }),
    );
  };

  const createWalls = () => {
    const width = props.building.size.grid.width;
    const length = props.building.size.grid.length;
    const height = props.building.size.grid.height;

    const tileWidth = constants.wireframeTileSize.width;
    const tileHeight = constants.wireframeTileSize.height;

    const walls = [];

    const x = props.building.position.grid.x * tileWidth;
    const y = props.building.position.grid.y * tileHeight;

    for (let i = 0; i < width; i++) {
      const distance = getDistance(
        {
          x: props.building.position.grid.x + i,
          y: props.building.position.grid.y + length,
        },
        "front",
      );

      walls.push(
        <div
          key={`front-${i}`}
          className={"building-wall front"}
          style={{
            width: tileWidth,
            height: height * tileHeight,
            left: x + i * tileWidth,
            top: y + length * tileWidth,
            zIndex: props.building.position.grid.x + props.building.position.grid.y + length + i,
            filter: `brightness(${distance}%)`,
          }}
        ></div>,
      );
    }

    for (let i = 0; i < props.building.size.grid.length; i++) {
      const distance = getDistance(
        {
          x: props.building.position.grid.x + width,
          y: props.building.position.grid.y + i,
        },
        "right",
      );

      walls.push(
        <div
          key={`right-${i}`}
          className={"building-wall right"}
          style={{
            width: height * tileHeight,
            height: tileHeight,
            left: x + width * tileWidth,
            top: y + i * tileHeight,
            zIndex: props.building.position.grid.x + props.building.position.grid.y + width + i,
            filter: `brightness(${distance}%)`,
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
          zIndex: props.building.position.grid.x + props.building.position.grid.y + width,
          transform: `translateZ(${height * tileHeight}px)`,
        }}
      ></div>,
    );

    return walls;
  };

  return <>{createWalls()}</>;
});
