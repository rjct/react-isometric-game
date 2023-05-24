import { useGameState } from "../../../hooks/useGameState";
import { composeSpriteUrl } from "../../../engine/helpers";
import { constants } from "../../../constants";
import React from "react";
import { TerrainArea } from "../../../engine/TerrainAreaFactory";

interface ClipMask {
  position: AreaCoordinates;
  size: Size;
  cellSize: Size;
}

export function TerrainAreaSourcePositionEditor() {
  const { gameState, gameDispatch } = useGameState();

  const emptyClipMask = {
    position: { x1: 0, y1: 0, x2: 0, y2: 0 },
    size: { width: 0, height: 0 },
    cellSize: { width: 0, height: 0 },
  };

  const [sourceImg, setSourceImg] = React.useState(null as unknown as HTMLImageElement);
  const [clipMask, setClipMask] = React.useState<ClipMask>({ ...emptyClipMask });
  const [clipMaskState, setClipMaskState] = React.useState({
    mode: null as unknown as "move" | "resize",
    initialMousePosition: null as unknown as Coordinates,
    initialMaskPosition: null as unknown as TerrainArea["source"]["position"],
  });

  const sourceImageRef = React.useRef<HTMLImageElement>(null);

  const handleClipMaskMouseDown = (e: React.MouseEvent) => {
    setClipMaskState({
      mode: "move",
      initialMousePosition: { x: e.clientX, y: e.clientY },
      initialMaskPosition: { ...clipMask.position },
    });
  };

  const handleClipMaskResizerMouseDown = (e: React.MouseEvent) => {
    setClipMaskState({
      mode: "resize",
      initialMousePosition: { x: e.clientX, y: e.clientY },
      initialMaskPosition: { ...clipMask.position },
    });

    e.stopPropagation();
  };

  const handleClipMaskMouseMove = (e: React.MouseEvent) => {
    if (!clipMaskState.mode) return;

    const diffX = Math.round((e.clientX - clipMaskState.initialMousePosition.x) / clipMask.cellSize.width);
    const diffY = Math.round((e.clientY - clipMaskState.initialMousePosition.y) / clipMask.cellSize.height);

    if (clipMaskState.mode === "move") {
      const width = clipMaskState.initialMaskPosition.x2 - clipMaskState.initialMaskPosition.x1;
      const height = clipMaskState.initialMaskPosition.y2 - clipMaskState.initialMaskPosition.y1;

      const x1 = Math.max(0, clipMaskState.initialMaskPosition.x1 + diffX);
      const y1 = Math.max(0, clipMaskState.initialMaskPosition.y1 + diffY);

      const x2 = x1 + width;
      const y2 = y1 + height;

      setClipMask({
        ...clipMask,
        position: {
          x1: Math.min(clipMask.size.width - width - 1, x1),
          y1: Math.min(clipMask.size.height - height - 1, y1),
          x2: Math.min(clipMask.size.width - 1, x2),
          y2: Math.min(clipMask.size.height - 1, y2),
        },
      });
    } else {
      const x2 = Math.max(0, clipMaskState.initialMaskPosition.x2 + diffX);
      const y2 = Math.max(0, clipMaskState.initialMaskPosition.y2 + diffY);

      setClipMask({
        ...clipMask,
        position: {
          x1: clipMaskState.initialMaskPosition.x1,
          y1: clipMaskState.initialMaskPosition.y1,
          x2: Math.min(clipMask.size.width - 1, x2),
          y2: Math.min(clipMask.size.height - 1, y2),
        },
      });
    }

    e.stopPropagation();
  };

  const handleClipMaskMouseLeave = () => {
    setClipMaskState({ ...clipMaskState, ...{ mode: null as unknown as "move" | "resize" } });
  };

  const handleClipMaskMouseUp = () => {
    setClipMaskState({ ...clipMaskState, ...{ mode: null as unknown as "move" | "resize" } });
  };

  React.useEffect(() => {
    if (!gameState.selectedTerrainArea) return;

    const fullSizeSource = gameState.mediaFiles[composeSpriteUrl(gameState.selectedTerrainArea.source.type)]?.img;

    setSourceImg(fullSizeSource || null);
  }, [gameState.selectedTerrainArea?.id, gameState.selectedTerrainArea?.source.type]);

  React.useEffect(() => {
    if (sourceImg) {
      const width = Math.max(1, sourceImg.width / (constants.tileSize.width + 3));
      const height = Math.max(1, sourceImg.height / (constants.tileSize.height + 3));

      const position = { ...gameState.selectedTerrainArea.source.position };

      if (sourceImageRef.current) {
        setClipMask({
          position,
          size: {
            width,
            height,
          },
          cellSize: {
            width: sourceImageRef.current.width / width,
            height: sourceImageRef.current.height / height,
          },
        });
      }
    } else {
      setClipMask({ ...emptyClipMask });
    }
  }, [sourceImg, gameState.selectedTerrainArea?.source.position]);

  React.useEffect(() => {
    if (!gameState.selectedTerrainArea || !sourceImg) return;

    gameDispatch({
      type: "setTerrainAreaSourcePosition",
      entityId: gameState.selectedTerrainArea.id,
      coordinates: clipMask.position,
    });
  }, [JSON.stringify(clipMask.position)]);

  return gameState.selectedTerrainArea && sourceImg ? (
    <div
      className={"terrain-area-source-editor"}
      onMouseMove={handleClipMaskMouseMove}
      onMouseLeave={handleClipMaskMouseLeave}
      onMouseUp={handleClipMaskMouseUp}
    >
      <div
        className={"clip-mask"}
        style={{
          left: clipMask.position.x1 * clipMask.cellSize.width,
          top: clipMask.position.y1 * clipMask.cellSize.height,
          width: (clipMask.position.x2 + 1 - clipMask.position.x1) * clipMask.cellSize.width,
          height: (clipMask.position.y2 + 1 - clipMask.position.y1) * clipMask.cellSize.height,
        }}
        data-dragging={!!clipMaskState.mode || null}
        onMouseDown={handleClipMaskMouseDown}
      >
        <div className={"clip-mask-resize"} onMouseDown={handleClipMaskResizerMouseDown}></div>
      </div>
      {<img ref={sourceImageRef} src={sourceImg?.src} />}
    </div>
  ) : null;
}
