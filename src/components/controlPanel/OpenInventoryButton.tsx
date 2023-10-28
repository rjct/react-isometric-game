import { faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const OpenInventoryButton = React.memo(() => {
  const { uiDispatch } = useGameState();
  const { hero } = useHero();
  const handleInventoryButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "inventory" });
  };

  return (
    <Button
      title={"Inventory (I)"}
      disabled={hero.isVehicleInUse()}
      className={["control-inventory"]}
      onClick={handleInventoryButtonClick}
    >
      <label>
        <FontAwesomeIcon icon={faSuitcaseRolling} size={"lg"} />
      </label>
    </Button>
  );
});
