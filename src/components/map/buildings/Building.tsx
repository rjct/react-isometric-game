import { Building } from "../../../engine/BuildingFactory";
import React from "react";
import { getEntityZIndex } from "../../../engine/helpers";
import { useGameState } from "../../../hooks/useGameState";

export function BuildingComponent(props: { building: Building }) {
  const { gameState, gameDispatch, uiState } = useGameState();

  const [viewport, setViewport] = React.useState(uiState.viewport);
  const [position, setPosition] = React.useState(gameState.gridToScreenSpace(props.building.position));
  const [zIndex, setZIndex] = React.useState(getEntityZIndex(props.building));

  const [draggableBuilding, setDraggableBuilding] = React.useState(null as unknown as Building);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (uiState.scene !== "editor") return;

    setDraggableBuilding(props.building);
    gameDispatch({ type: "setSelectedBuilding", entity: props.building });

    e.stopPropagation();
  };

  const handleMouseUp = () => {
    if (uiState.scene !== "editor") return;

    setDraggableBuilding(null as unknown as Building);
  };

  React.useEffect(() => {
    setViewport(uiState.viewport);
  }, [uiState.viewport]);

  React.useEffect(() => {
    setPosition(gameState.gridToScreenSpace(props.building.position));
  }, [props.building.position]);

  React.useEffect(() => {
    if (uiState.scene !== "editor" || !draggableBuilding || uiState.mousePosition.isOutOfGrid) return;

    gameState.setGridMatrixOccupancy([props.building], gameState.matrix, -1);

    setPosition(gameState.gridToScreenSpace(uiState.mousePosition.grid));
    draggableBuilding.position = uiState.mousePosition.grid;
    setZIndex(getEntityZIndex(draggableBuilding));
    gameState.setGridMatrixOccupancy([draggableBuilding], gameState.matrix, 1);
  }, [uiState.mousePosition.grid]);

  return gameState.isEntityInViewport(props.building, viewport) ? (
    <div
      className={props.building.className}
      id={props.building.id}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
      }}
      data-direction={props.building.direction}
      data-variant={props.building.variant}
      data-selected={props.building.id === gameState.selectedBuilding?.id || null}
      data-dragging={props.building.id === draggableBuilding?.id || null}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    ></div>
  ) : null;
}
