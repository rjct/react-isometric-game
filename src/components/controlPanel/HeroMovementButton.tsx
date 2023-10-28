import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons/faPersonRunning";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons/faPersonWalking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { UnitMovementMode } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

const heroMovementTypes: { [t in UnitMovementMode]: { text: string; icon: IconDefinition } } = {
  walk: {
    text: "Walk",
    icon: faPersonWalking,
  },
  run: {
    text: "Run",
    icon: faPersonRunning,
  },
};

export const HeroMovementButton = React.memo(() => {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  const handleClick = () => {
    if (hero.isMoving()) return;

    if (hero.currentSelectedAction === "move") {
      gameDispatch({
        type: "setUnitMovementMode",
        unit: hero,
        mode: hero.currentMovementMode === "walk" ? "run" : "walk",
      });
    } else {
      gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: "move" });
    }
  };

  return (
    <Button
      className={[`control-movement`]}
      active={hero.currentSelectedAction === "move"}
      title={heroMovementTypes[hero.currentMovementMode].text}
      disabled={hero.isMoving() || hero.isVehicleInUse()}
      onClick={handleClick}
    >
      <label>
        <FontAwesomeIcon icon={heroMovementTypes[hero.currentMovementMode].icon} />
      </label>
    </Button>
  );
});
