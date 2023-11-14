import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const PauseButton = React.memo(() => {
  const { uiDispatch } = useGameState();
  const handleClick = () => {
    uiDispatch({ type: "setScene", scene: "pause" });
  };

  return (
    <Button onClick={handleClick}>
      <label>
        <FontAwesomeIcon icon={faBars} />
      </label>
    </Button>
  );
});
