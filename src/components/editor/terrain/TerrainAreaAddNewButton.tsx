import { faSquarePlus } from "@fortawesome/free-solid-svg-icons/faSquarePlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { constants } from "@src/engine/constants";
import { StaticMapTerrainArea } from "@src/context/GameStateContext";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainAreaAddNewButton = React.memo(function TerrainAreaAddNewButton() {
  const { gameState, terrainDispatch, uiState } = useGameState();
  const handleClick = () => {
    const target = {
      x1: Math.round(gameState.mapSize.width / 2),
      y1: Math.round(gameState.mapSize.height / 2),
      x2: Math.round(gameState.mapSize.width / 2) + 1,
      y2: Math.round(gameState.mapSize.height / 2) + 1,
    };

    const terrainArea: StaticMapTerrainArea = {
      source: {
        type: "empty",
        position: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
        },
      },
      target,
      exitUrl: null,
    };

    uiState.setScroll({
      x: target.x1 * constants.tileSize.width - (uiState.viewport.screen.x2 - uiState.viewport.screen.x1) / 2,
      y: target.y1 * constants.tileSize.height - (uiState.viewport.screen.y2 - uiState.viewport.screen.y1) / 2,
    });

    terrainDispatch({ type: "addTerrainArea", entity: terrainArea, mapSize: gameState.mapSize });
  };

  return (
    <Button className={["ui-button-green"]} onClick={handleClick}>
      <FontAwesomeIcon icon={faSquarePlus} fixedWidth />
      <label>Add new terrain area</label>
    </Button>
  );
});
