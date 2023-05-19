import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { TerrainAreaEditor } from "./TerrainAreaEditor";
import { TerrainArea } from "../../../engine/TerrainAreaFactory";

export const TerrainEditor = React.memo(function TerrainEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const [workingArea, setWorkingArea] = React.useState({
    mode: null as unknown as "move" | "resize",
    initialMousePosition: null as unknown as Coordinates,
    initialAreaPosition: null as unknown as TerrainArea["target"],
    area: null as unknown as TerrainArea,
  });

  const [workingAreaSize, setWorkingAreaSize] = React.useState({ width: 0, height: 0 });

  const tileWidth = constants.tileSize.width;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const handleMouseMove = () => {
    if (!workingArea.mode || uiState.mousePosition.isOutOfGrid) return;

    const diffX = workingArea.initialMousePosition.x - uiState.mousePosition.grid.x;
    const diffY = workingArea.initialMousePosition.y - uiState.mousePosition.grid.y;

    switch (workingArea.mode) {
      case "move":
        gameDispatch({
          type: "setTerrainAreaPosition",
          entityId: workingArea.area.id,
          coordinates: {
            x: Math.max(0, workingArea.initialAreaPosition.x1 - diffX),
            y: Math.max(0, workingArea.initialAreaPosition.y1 - diffY),
          },
        });

        break;

      case "resize":
        if (
          workingAreaSize.width !== workingArea.initialAreaPosition.x2 - diffX - workingArea.initialAreaPosition.x1 ||
          workingAreaSize.height !== workingArea.initialAreaPosition.y2 - diffY - workingArea.initialAreaPosition.y1
        ) {
          setWorkingAreaSize({
            width: workingArea.initialAreaPosition.x2 - diffX - workingArea.initialAreaPosition.x1,
            height: workingArea.initialAreaPosition.y2 - diffY - workingArea.initialAreaPosition.y1,
          });
        }

        break;
    }
  };

  const handleMouseUp = () => {
    setWorkingArea({
      mode: null as unknown as "move" | "resize",
      initialMousePosition: null as unknown as Coordinates,
      initialAreaPosition: null as unknown as TerrainArea["target"],
      area: null as unknown as TerrainArea,
    });

    setWorkingAreaSize({ width: 0, height: 0 });
  };

  const handleAreaRectMouseDown = (e: React.MouseEvent, area: TerrainArea) => {
    gameDispatch({ type: "setSelectedTerrainArea", entity: area });

    setWorkingArea({
      mode: "move",
      initialMousePosition: { ...uiState.mousePosition.grid },
      initialAreaPosition: { ...area.target },
      area,
    });

    e.stopPropagation();
  };

  const handleAreaResizerMouseDown = (e: React.MouseEvent, area: TerrainArea) => {
    gameDispatch({ type: "setSelectedTerrainArea", entity: area });

    setWorkingArea({
      mode: "resize",
      initialMousePosition: { ...uiState.mousePosition.grid },
      initialAreaPosition: { ...area.target },
      area,
    });

    e.stopPropagation();
  };

  React.useEffect(() => {
    if (workingArea.mode !== "resize") return;

    workingArea.area.resizeTo(workingAreaSize);
  }, [workingAreaSize]);

  return uiState.scene == "editor" && uiState.editorMode == "terrain" ? (
    <svg
      className="terrain-editor"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      baseProfile="full"
      style={{
        width: mapWidth * wireframeTileWidth,
        height: mapHeight * wireframeTileHeight,
        left: (mapWidth * tileWidth) / 2,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      data-editing-mode={workingArea.mode}
    >
      <pattern
        id="pattern-checkers"
        x="0"
        y="0"
        width={wireframeTileWidth}
        height={wireframeTileHeight}
        patternUnits="userSpaceOnUse"
      >
        <line x1="0" y1="0" x2={wireframeTileWidth} y2={0} stroke="rgba(255,255,255,0.5)" />
        <line x1="0" y1="0" x2={0} y2={wireframeTileHeight} stroke="rgba(255,255,255,0.5)" />
      </pattern>

      <rect
        x="0"
        y="0"
        width={mapWidth * wireframeTileWidth}
        height={mapHeight * wireframeTileHeight}
        fill="url(#pattern-checkers)"
      ></rect>

      {gameState.terrain.map((terrainArea) => {
        return (
          <TerrainAreaEditor
            key={terrainArea.id}
            area={terrainArea}
            selected={terrainArea.id === gameState.selectedTerrainArea?.id}
            dragging={terrainArea.id === workingArea?.area?.id}
            handleAreaRectMouseDown={handleAreaRectMouseDown}
            handleAreaResizerMouseDown={handleAreaResizerMouseDown}
          />
        );
      })}
    </svg>
  ) : null;
});
