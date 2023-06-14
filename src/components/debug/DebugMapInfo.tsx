import React from "react";
import { useGameState } from "../../hooks/useGameState";

export function DebugMapInfo() {
  const { gameState } = useGameState();
  const mapStat = () => {
    return Object.entries({
      Units: Object.keys(gameState.units).length,
      Buildings: gameState.buildings.length,
      Lights: gameState.lights.length,
      TerrainAreas: gameState.terrain.length,
    }).map(([key, value]) => {
      return (
        <span key={key}>
          {key}
          <label>{value}</label>
        </span>
      );
    });
  };

  return (
    <>
      {gameState.mapSize.width}x{gameState.mapSize.height} | {mapStat()}
    </>
  );
}
