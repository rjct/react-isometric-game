import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const HeroLootButton = React.memo(() => {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  if (hero.isVehicleInUse()) return null;

  const handleClick = () => {
    if (hero.isBusy()) return;

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: "loot" });
  };

  return (
    <Button
      className={["control-loot"]}
      active={hero.currentSelectedAction === "loot"}
      disabled={hero.isBusy()}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faEye} />
    </Button>
  );
});
