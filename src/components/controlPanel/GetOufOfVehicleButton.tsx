import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const GetOufOfVehicleButton = React.memo(() => {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  if (!hero.isVehicleInUse()) return null;

  const handleClick = () => {
    gameDispatch({ type: "getOutOfVehicle", unit: hero });
  };

  return (
    <Button
      title={"Get out of the vehicle"}
      className={["control-get-out-of-vehicle"]}
      //active={!!hero.getVehicleInUse()}
      disabled={hero.getVehicleInUse()!.speed.current > 0}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </Button>
  );
});
