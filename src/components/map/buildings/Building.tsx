import { Building } from "../../../engine/BuildingFactory";
import React from "react";
import { getEntityZIndex } from "../../../engine/helpers";
import { useGameState } from "../../../hooks/useGameState";

export const BuildingComponent = React.memo(function Building(props: {
  building: Building;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Building) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) {
  const { gameState, uiState } = useGameState();

  const [viewport, setViewport] = React.useState(uiState.viewport);
  const position = gameState.gridToScreenSpace(props.building.position);

  React.useEffect(() => {
    setViewport(uiState.viewport);
  }, [uiState.viewport]);

  return gameState.isEntityInViewport(props.building, viewport) ? (
    <div
      draggable={false}
      className={props.building.className}
      id={props.building.id}
      style={{
        left: position.x,
        top: position.y,
        zIndex: getEntityZIndex(props.building),
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
    ></div>
  ) : null;
});
