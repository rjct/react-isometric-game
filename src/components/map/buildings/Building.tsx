import { Building } from "../../../engine/BuildingFactory";
import React, { CSSProperties } from "react";

export const BuildingComponent = React.memo(function Building(props: {
  building: Building;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Building) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  maskImage: CSSProperties["WebkitMaskImage"];
}) {
  return (
    <div
      draggable={false}
      className={props.building.className}
      id={props.building.id}
      style={{
        left: props.building.screenPosition.x,
        top: props.building.screenPosition.y,
        zIndex: props.building.zIndex,
        WebkitMaskImage: props.maskImage,
      }}
      data-direction={props.building.direction}
      data-variant={props.building.variant}
      data-selected={props.selected || null}
      data-dragging={props.dragging || null}
      onMouseDown={(e: React.MouseEvent) => {
        if (props.onMouseDown) {
          props.onMouseDown(e, props.building);
        }
      }}
      onMouseUp={props.onMouseUp}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    ></div>
  );
});
