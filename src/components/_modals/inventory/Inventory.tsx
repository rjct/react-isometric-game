import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { Armor } from "@src/components/_modals/inventory/Armor";
import { EntityOverview } from "@src/components/_modals/inventory/EntityOverview";
import { Hand } from "@src/components/_modals/inventory/Hand";
import { InventoryItemInfo } from "@src/components/_modals/inventory/InventoryItemInfo";
import { InventoryStorage } from "@src/components/_modals/inventory/InventoryStorage";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export function Inventory() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();
  const { hero } = useHero();

  const [scenesHistory, saveScenesHistory] = React.useState([uiState.scene]);

  React.useEffect(() => {
    const scenes = [...scenesHistory];

    scenes.push(uiState.scene);

    saveScenesHistory(scenes);

    return () => {
      saveScenesHistory([]);
    };
  }, [uiState.scene]);

  if (!checkCurrentScene(["inventory"])) return null;

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  const handleClickOut = () => {
    gameDispatch({ type: "setSelectedInventoryItem", item: null });
  };

  return (
    <FullscreenPanel overlay={true} onClick={handleClickOut}>
      <div className={"inventory"}>
        <InventoryStorage
          owner={hero}
          inventoryType={"main"}
          className={["inventory-storage-wrapper"]}
          title={"Backpack"}
        />
        <Hand title={"Left hand"} className={"left-hand-wrapper"} inventoryType={"leftHand"} />
        <Hand title={"Right Hand"} className={"right-hand-wrapper"} inventoryType={"rightHand"} />
        <EntityOverview entity={hero} className={["entity-overview-wrapper"]} title={"Hero"} />
        <InventoryItemInfo item={gameState.selectedInventoryItem} />
        <Armor />

        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
