import { faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const OpenInventoryButton = React.memo(() => {
  const { uiDispatch } = useGameState();
  const handleInventoryButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "inventory" });
  };

  return (
    <Button title={"Inventory (I)"} className={["control-inventory"]} onClick={handleInventoryButtonClick}>
      <label>
        <FontAwesomeIcon icon={faSuitcaseRolling} size={"lg"} />
      </label>
    </Button>
  );
});
