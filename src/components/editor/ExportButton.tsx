import { StaticMap } from "../../context/GameStateContext";
import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { useHero } from "../../hooks/useHero";

export function ExportButton() {
  const { gameState } = useGameState();
  const { hero } = useHero();

  const handleClick = () => {
    const result: StaticMap = {
      size: { ...gameState.mapSize },
      terrain: { ...gameState.terrain },
      heroStartPosition: { ...hero.getRoundedPosition() },
      enemies: gameState.getAliveEnemiesArray().map((enemy) => {
        return {
          type: enemy.type,
          position: enemy.getRoundedPosition(),
        };
      }),
      buildings: gameState.buildings.map((building) => {
        return {
          type: building.type,
          position: { ...building.position },
          direction: building.direction,
          variant: building.variant,
        };
      }),
      exitPoints: gameState.getExitPoints(),
    };

    // eslint-disable-next-line
    console.log(JSON.stringify(result));
  };

  return (
    <button className={"ui-button"} onClick={handleClick}>
      <label>Get map JSON</label>
    </button>
  );
}
