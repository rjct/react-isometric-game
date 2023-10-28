import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const HeroExploreButton = React.memo(() => {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  if (hero.isVehicleInUse()) return null;

  const handleClick = () => {
    if (hero.isMoving()) return;

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: "explore" });
  };

  return (
    <Button
      className={["control-explore"]}
      active={hero.currentSelectedAction === "explore"}
      disabled={hero.isMoving()}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faEye} />
    </Button>
  );
});
