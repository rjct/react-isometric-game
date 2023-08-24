import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";

export const WireframeEntityPlaceholder = React.memo(() => {
  const { gameState, uiState, gameDispatch } = useGameState();

  React.useEffect(() => {
    if (uiState.scene !== "editor") return;

    const selectedEntity = gameState.selectedBuilding || gameState.selectedUnit;

    if (selectedEntity) {
      gameDispatch({
        type: "highlightEntityPlaceholder",
        size: selectedEntity.size.grid,
        position: selectedEntity.position,
        direction: selectedEntity.direction,
      });
    } else {
      gameDispatch({ type: "clearEntityPlaceholder" });
    }
  }, [gameState.selectedBuilding?.getHash(), gameState.selectedUnit?.getHash()]);

  return gameState.entityPlaceholder ? (
    <div
      className={"wireframe-placeholder"}
      style={{
        left: gameState.entityPlaceholder.position.x * constants.wireframeTileSize.width,
        top: gameState.entityPlaceholder.position.y * constants.wireframeTileSize.height,
        width: gameState.entityPlaceholder.size.width * constants.wireframeTileSize.width,
        height: gameState.entityPlaceholder.size.length * constants.wireframeTileSize.height,
      }}
    ></div>
  ) : null;
});