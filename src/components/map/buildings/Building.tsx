import { Building } from "@src/engine/BuildingFactory";
import { getCss3dPosition } from "@src/engine/helpers";
import React, { CSSProperties } from "react";

export const BuildingComponent = React.memo(function Building(props: {
  building: Building;
  selected?: boolean;
  dragging?: boolean;
  highlightedForInventoryTransfer?: boolean;
  selectedForInventoryTransfer?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Building) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  maskImage?: CSSProperties["WebkitMaskImage"];
  isInHeroView?: boolean;
}) {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (props.onMouseDown) {
      props.onMouseDown(e, props.building);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (props.onMouseUp) {
      props.onMouseUp(e);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      draggable={false}
      className={props.building.className}
      id={props.building.id}
      style={{
        transform: getCss3dPosition(props.building.position.screen, false),
        zIndex: props.building.zIndex,
        WebkitMaskImage: props.maskImage,
      }}
      data-direction={props.building.direction}
      data-variant={props.building.variant}
      data-selected={props.selected || null}
      data-dragging={props.dragging || null}
      data-selected-for-inventory-transfer={
        props.highlightedForInventoryTransfer || props.selectedForInventoryTransfer || null
      }
      data-in-hero-view={props.isInHeroView}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    ></div>
  );
});
