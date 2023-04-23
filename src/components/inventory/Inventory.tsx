import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Button } from "../ui/Button";
import { Backpack } from "./Backpack";
import { Hand } from "./Hand";

export function Inventory() {
  const { uiState, uiDispatch } = useGameState();

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "toggleInventory" });
  };

  return uiState.scene === "inventory" ? (
    <div className={"inventory-modal"}>
      <div className={"inventory"}>
        <div className={"with-overlay"}></div>

        <fieldset className={"backpack-wrapper"}>
          <legend>Backpack</legend>
          <Backpack />
        </fieldset>

        <fieldset className={"left-hand-wrapper"}>
          <legend>Left Hand</legend>
          <Hand inventoryType={"leftHand"} />
        </fieldset>
        <fieldset className={"right-hand-wrapper"}>
          <legend>Right Hand</legend>
          <Hand inventoryType={"rightHand"} />
        </fieldset>
        <fieldset className={"hero-overview-wrapper"}></fieldset>
        <fieldset className={"hero-info-wrapper"}></fieldset>
        <fieldset className={"armor-wrapper"}>
          <legend>Armor</legend>
        </fieldset>
        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
