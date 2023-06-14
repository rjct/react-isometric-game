import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useHero } from "../../../hooks/useHero";
import { Canvas } from "../../_shared/Canvas";
import { useHeroVisualization } from "../../../hooks/useHeroVisualization";
import { useMousePosition, WorldMousePosition } from "../../../hooks/useMousePosition";
import { Unit } from "../../../engine/UnitFactory";

export const WireframeTiles = React.memo(function WireframeTiles() {
  const { gameState, gameDispatch, uiState } = useGameState();
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

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const hero = gameState.getHero();
    const userActions: Array<Unit["currentSelectedAction"]> = ["walk", "run", "useLeftHand", "useRightHand"];

    const currentActionIndex = userActions.indexOf(hero.currentSelectedAction);
    const nextActionIndex = currentActionIndex + 1 >= userActions.length ? 0 : currentActionIndex + 1;
    const nextAction = userActions[nextActionIndex];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: nextAction });
  };

  React.useEffect(() => {
    setMousePosition(null as unknown as WorldMousePosition);
  }, [gameState.mapUrl]);

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
      handleRightClick={handleRightClick}
    />
  ) : null;
});
