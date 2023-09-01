import { Armor } from "@src/components/inventory/Armor";
import { Backpack } from "@src/components/inventory/Backpack";
import { Hand } from "@src/components/inventory/Hand";
import { HeroInfo } from "@src/components/inventory/HeroInfo";
import { HeroOverview } from "@src/components/inventory/HeroOverview";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

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
