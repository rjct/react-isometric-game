import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useHero } from "../../../hooks/useHero";
import { Canvas } from "../../_shared/Canvas";
import { useHeroVisualization } from "../../../hooks/useHeroVisualization";
import { useMousePosition, WorldMousePosition } from "../../../hooks/useMousePosition";

export const WireframeTiles = React.memo(function WireframeTiles() {
  const { gameState, uiState } = useGameState();
  const { doHeroAction } = useHero();

  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { renderTarget } = useHeroVisualization({ canvasRef });

  const { getWorldMousePosition } = useMousePosition();

  const [mousePosition, setMousePosition] = React.useState(null as unknown as WorldMousePosition);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition(getWorldMousePosition(e));
  };

  const handleClick = () => {
    doHeroAction(mousePosition);
  };

  React.useEffect(() => {
    if (!mousePosition) return;

    renderTarget(mousePosition);
  }, [mousePosition, gameState.getMatrixHash()]);

  return uiState.scene === "game" ? (
    <Canvas
      className={"wireframe"}
      size={gameState.mapSize}
      ref={canvasRef}
      handleMouseMove={handleMouseMove}
      handleClick={handleClick}
    />
  ) : null;
});
