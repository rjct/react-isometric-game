import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Button } from "../ui/Button";

export function Inventory() {
  const { uiState, uiDispatch } = useGameState();

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "toggleInventory" });
  };

  return uiState.scene === "inventory" ? (
    <div className={"inventory-modal"}>
      <div className={"inventory"}>
        <div className={"with-overlay"}></div>

        <fieldset className={"backpack"}>
          <legend>Backpack</legend>
        </fieldset>

        <fieldset className={"left-hand"}></fieldset>
        <fieldset className={"right-hand"}></fieldset>
        <fieldset className={"hero-overview"}></fieldset>
        <fieldset className={"hero-info"}></fieldset>
        <fieldset className={"armor"}></fieldset>
        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
