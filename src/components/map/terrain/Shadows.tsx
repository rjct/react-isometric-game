import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { ShadowRay, useShadows } from "../../../hooks/useShadows";
import { Canvas } from "../../_shared/Canvas";
import { Unit } from "../../../engine/UnitFactory";
import { useCanvas } from "../../../hooks/useCanvas";

export const Shadows = React.memo(() => {
  const { gameState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const [rays, setRays] = React.useState<Array<{ unit: Unit; shadowRay: ShadowRay }>>();

  const { clearCanvas } = useCanvas();

  React.useEffect(() => {
    if (canvasRef.current) {
      const { createRay } = useShadows();

      setRays(
        Object.values(gameState.units).map((unit) => {
          return { unit, shadowRay: createRay(canvasRef.current, unit.position, gameState.mapSize) };
        })
      );
    }
  }, [Object.values(gameState.units).length, canvasRef.current]);

  React.useEffect(() => {
    if (!rays || !gameState.debug.featureEnabled.shadows) {
      if (canvasRef.current) {
        clearCanvas(canvasRef.current.getContext("2d")!);
      }

      return;
    }

    const { updateRays } = useShadows();

    updateRays(canvasRef.current, rays, gameState.buildings);
  }, [
    rays,
    JSON.stringify(Object.values(gameState.units).map((unit) => unit.position)),
    gameState.debug.featureEnabled.shadows,
  ]);

  return <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />;
});
