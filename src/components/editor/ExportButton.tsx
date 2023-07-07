import { StaticMap } from "../../context/GameStateContext";
import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { useHero } from "../../hooks/useHero";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";

export const ExportButton = React.memo(function ExportButton() {
  const { gameState } = useGameState();
  const { hero } = useHero();

  const text = {
    getJson: "Get map JSON",
    done: "Copied to clipboard",
  };

  const [buttonState, setButtonState] = React.useState({
    disabled: false,
    text: text.getJson,
  });

  const handleClick = () => {
    const result: StaticMap = {
      size: { ...gameState.mapSize },
      terrain: gameState.terrain.map((terrainArea) => {
        return terrainArea.getJSON();
      }),
      hero: hero.getJSON(true),
      enemies: gameState.getAliveEnemiesArray().map((enemy) => enemy.getJSON()),
      buildings: gameState.buildings.map((building) => building.getJSON()),
      shadows: gameState.shadows,
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

    navigator.clipboard.writeText(JSON.stringify(result)).then(() => {
      setButtonState({ disabled: true, text: text.done });

      window.setTimeout(() => {
        setButtonState({ disabled: false, text: text.getJson });
      }, 1000);
    });
  };

  return (
    <button
      className={["ui-button", buttonState.disabled ? "ui-button-green" : ""].join(" ")}
      disabled={buttonState.disabled}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faCode} fixedWidth />
      <label>{buttonState.text}</label>
    </button>
  );
});
