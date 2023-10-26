import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { StaticMap } from "@src/context/GameStateContext";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const ExportButton = React.memo(function ExportButton() {
  const { terrainState, gameState } = useGameState();
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
      terrain: terrainState.areas.map((terrainArea) => {
        return terrainArea.getJSON();
      }),
      hero: hero.getJSON(true),
      enemies: gameState.getAllEnemiesArray().map((enemy) => enemy.getJSON()),
      buildings: gameState.buildings.map((building) => building.getJSON()),
      vehicles: gameState.vehicles.map((vehicle) => vehicle.getJSON()),
      globalShadows: gameState.globalShadows,
      globalLights: gameState.globalLights,
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
    <Button
      className={[buttonState.disabled ? "ui-button-green" : ""]}
      disabled={buttonState.disabled}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faCode} fixedWidth />
      <label>{buttonState.text}</label>
    </Button>
  );
});
