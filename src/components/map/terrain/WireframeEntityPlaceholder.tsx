import { constants } from "@src/constants";
import { getCss3dPosition } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

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
        transform: getCss3dPosition(gameState.entityPlaceholder.position),
        width: gameState.entityPlaceholder.size.width * constants.wireframeTileSize.width,
        height: gameState.entityPlaceholder.size.length * constants.wireframeTileSize.height,
      }}
    ></div>
  ) : null;
});
