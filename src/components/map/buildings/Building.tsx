import { Building } from "../../../engine/BuildingFactory";
import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useHero } from "../../../hooks/useHero";

export const BuildingComponent = React.memo(function Building(props: {
  building: Building;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Building) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) {
  const { gameState } = useGameState();

  const position = React.useMemo(() => gameState.gridToScreenSpace(props.building.position), [props.building.position]);
  const { getHeroMaskImage } = useHero();

  return (
    <div
      draggable={false}
      className={props.building.className}
      id={props.building.id}
      style={{
        left: position.x,
        top: position.y,
        zIndex: props.building.zIndex,
        WebkitMaskImage: getHeroMaskImage(props.building),
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
