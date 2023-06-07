import { StaticMap } from "../../context/GameStateContext";
import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { useHero } from "../../hooks/useHero";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";

export function ExportButton() {
  const { gameState } = useGameState();
  const { hero } = useHero();

  const handleClick = () => {
    const result: StaticMap = {
      size: { ...gameState.mapSize },
      terrain: gameState.terrain.map((terrainArea) => {
        return terrainArea.getJSON();
      }),
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
      lights: gameState.lights.map((light) => {
        return {
          position: light.position,
          color: light.getColor(),
          radius: light.radius,
        };
      }),
    };

    // eslint-disable-next-line
    console.log(JSON.stringify(result));
  };

  return (
    <button className={"ui-button"} onClick={handleClick}>
      <FontAwesomeIcon icon={faCode} fixedWidth />
      <label>Get map JSON</label>
    </button>
  );
}
