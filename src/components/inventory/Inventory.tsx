import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { Button } from "../ui/Button";
import { Backpack } from "./Backpack";
import { Hand } from "./Hand";
import { HeroOverview } from "./HeroOverview";
import { HeroInfo } from "./HeroInfo";
import { Armor } from "./Armor";

export function Inventory() {
  const { uiState, uiDispatch } = useGameState();

  const [scenesHistory, saveScenesHistory] = React.useState([uiState.scene]);

  React.useEffect(() => {
    const scenes = [...scenesHistory];

    scenes.push(uiState.scene);

    saveScenesHistory(scenes);

    return () => {
      saveScenesHistory([]);
    };
  }, [uiState.scene]);

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  return uiState.scene === "inventory" ? (
    <div className={"inventory-modal"}>
      <div className={"inventory"}>
        <div className={"with-overlay"}></div>

        <Backpack />
        <Hand title={"Left hand"} className={"left-hand-wrapper"} inventoryType={"leftHand"} />
        <Hand title={"Right Hand"} className={"right-hand-wrapper"} inventoryType={"rightHand"} />
        <HeroOverview />
        <HeroInfo />
        <Armor />

        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
