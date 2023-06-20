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
        <span className={"debug-label"} key={key}>
          <span className={"debug-label-title"}>{key}</span>
          <label className={"debug-label-value"}>{value}</label>
        </span>
      );
    });
  };

  return <span>{mapStat()}</span>;
}
