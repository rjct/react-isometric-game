import { faArrowsToDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const CenterMapButton = React.memo(() => {
  const { uiDispatch } = useGameState();
  const { hero } = useHero();

  const handleCenterMapOnHeroClick = () => {
    uiDispatch({ type: "centerMapOnHero", unitCoordinates: hero.position.screen });
  };

  return (
    <Button title={"Center map (C)"} className={["control-center-map"]} onClick={handleCenterMapOnHeroClick}>
      <label>
        <FontAwesomeIcon icon={faArrowsToDot} size={"lg"} />
      </label>
    </Button>
  );
});
