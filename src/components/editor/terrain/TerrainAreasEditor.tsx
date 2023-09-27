import { TerrainAreaEditor } from "@src/components/editor/terrain/TerrainAreaEditor";
import { constants } from "@src/engine/constants";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useMousePosition } from "@src/hooks/useMousePosition";
import React from "react";

export const TerrainAreasEditor = React.memo(function TerrainEditor() {
  const { gameState, terrainState, terrainDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingArea, setWorkingArea] = React.useState({
    mode: null as unknown as "move" | "resize",
    initialMousePosition: null as unknown as GridCoordinates,
    initialAreaPosition: null as unknown as TerrainArea["target"],
    area: null as unknown as TerrainArea,
  });

  const [workingAreaSize, setWorkingAreaSize] = React.useState({ width: 0, height: 0 });

  const tileWidth = constants.tileSize.width;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingArea.mode) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingArea.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingArea.initialMousePosition.y - mousePosition.grid.y;

    switch (workingArea.mode) {
      case "move":
        terrainDispatch({
          type: "setTerrainAreaPosition",
          entityId: workingArea.area.id,
          coordinates: {
            x: Math.min(
              gameState.mapSize.width - (workingArea.area.target.x2 - workingArea.area.target.x1),
              Math.max(0, workingArea.initialAreaPosition.x1 - diffX),
            ),
            y: Math.min(
              gameState.mapSize.height - (workingArea.area.target.y2 - workingArea.area.target.y1),
              Math.max(0, workingArea.initialAreaPosition.y1 - diffY),
            ),
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
      initialMousePosition: null as unknown as GridCoordinates,
      initialAreaPosition: null as unknown as TerrainArea["target"],
      area: null as unknown as TerrainArea,
    });

    setWorkingAreaSize({ width: 0, height: 0 });
  };

  const handleAreaRectMouseDown = (e: React.MouseEvent, area: TerrainArea) => {
    terrainDispatch({ type: "setSelectedTerrainArea", entity: area });

    const mousePosition = getWorldMousePosition(e);

    setWorkingArea({
      mode: "move",
      initialMousePosition: { ...mousePosition.grid },
      initialAreaPosition: { ...area.target },
      area,
    });

    e.stopPropagation();
  };

  const handleAreaResizerMouseDown = (e: React.MouseEvent, area: TerrainArea) => {
    terrainDispatch({ type: "setSelectedTerrainArea", entity: area });

    const mousePosition = getWorldMousePosition(e);

    setWorkingArea({
      mode: "resize",
      initialMousePosition: { ...mousePosition.grid },
      initialAreaPosition: { ...area.target },
      area,
    });

    e.stopPropagation();
  };

  React.useEffect(() => {
    if (workingArea.mode !== "resize") return;

    workingArea.area.resizeTo(workingAreaSize);
  }, [workingAreaSize]);

  React.useEffect(() => {
    if (!terrainState.selectedTerrainArea) return;

    terrainDispatch({ type: "clearTerrainClusters", clusters: terrainState.clusters }); // FIXME: Clear only affected clusters
  }, [terrainState.getTerrainHash()]);

  return uiState.scene == "editor" && uiState.editorMode == "terrain" ? (
    <div
      className="terrain-editor"
      style={{
        width: mapWidth * wireframeTileWidth,
        height: mapHeight * wireframeTileHeight,
        left: (mapWidth * tileWidth) / 2,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      data-editing-mode={workingArea.mode}
    >
      {terrainState.areas.map((terrainArea) => {
        return (
          <TerrainAreaEditor
            key={terrainArea.id}
            area={terrainArea}
            selected={terrainArea.id === terrainState.selectedTerrainArea?.id}
            dragging={terrainArea.id === workingArea?.area?.id}
            handleAreaRectMouseDown={handleAreaRectMouseDown}
            handleAreaResizerMouseDown={handleAreaResizerMouseDown}
          />
        );
      })}
    </div>
  ) : null;
});
