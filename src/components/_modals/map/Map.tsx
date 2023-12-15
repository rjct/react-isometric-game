import { InputRange } from "@src/components/editor/_shared/InputRange";
import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { useGameState } from "@src/hooks/useGameState";
import { useMap } from "@src/hooks/useMap";
import { useScene } from "@src/hooks/useScene";
import React, { useState } from "react";

export function Map() {
  const { gameState, uiState, uiDispatch } = useGameState();
  const { checkCurrentScene, scenesHistory } = useScene();
  const { renderMap } = useMap(gameState);

  const mapContainerRef = React.createRef<HTMLDivElement>();
  const mapCanvasRef = React.createRef<HTMLCanvasElement>();

  const [mapZoom, setMapZoom] = React.useState(0.3);

  const [canvasSize, setCanvasSize] = React.useState<Size2D>({
    width: 0,
    height: 0,
  });

  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!checkCurrentScene(["map"])) return;

    const mapSize = {
      width: mapContainerRef.current!.clientWidth,
      height: mapContainerRef.current!.clientHeight,
    };

    setCanvasSize(mapSize);

    const ctx = mapCanvasRef.current?.getContext("2d");

    if (ctx) {
      setTimeout(() => {
        renderMap(ctx, mapZoom, mapSize, offset);
      }, 0);
    }
  }, [uiState.scene, mapZoom]);

  if (!checkCurrentScene(["map"])) return null;

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mapCanvasRef.current) {
      setIsDragging(true);

      const offsetX = event.clientX;
      const offsetY = event.clientY;
      setStartPosition({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && mapCanvasRef.current) {
      const currentX = event.clientX;
      const currentY = event.clientY;

      const x = (currentX - startPosition.x) / 10 + offset.x;
      const y = (currentY - startPosition.y) / 10 + offset.y;

      setOffset({ x, y });

      const ctx = mapCanvasRef.current.getContext("2d");

      if (ctx) {
        const mapSize = {
          width: mapContainerRef.current!.clientWidth,
          height: mapContainerRef.current!.clientHeight,
        };

        renderMap(ctx, mapZoom, mapSize, { x, y });
      }
    }
  };

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  return (
    <FullscreenPanel overlay={true}>
      <div className={"modal"}>
        <div className={"modal-content map"} ref={mapContainerRef}>
          <canvas
            ref={mapCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          ></canvas>
        </div>

        <div className={"modal-controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>close</label>
          </Button>

          <InputRange
            min={0.1}
            max={2}
            step={0.01}
            initialValue={mapZoom}
            valueSuffix={""}
            onChange={(value) => setMapZoom(value)}
          />

          <Button onClick={() => setMapZoom(mapZoom - 0.1)}>
            <label>-</label>
          </Button>
          <Button onClick={() => setMapZoom(mapZoom + 0.1)}>
            <label>+</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
