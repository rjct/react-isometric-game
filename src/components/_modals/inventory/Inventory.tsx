import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { ArmorPanel } from "@src/components/_modals/inventory/_shared/ArmorPanel";
import { EntityOverviewPanel } from "@src/components/_modals/inventory/_shared/EntityOverviewPanel";
import { Hand } from "@src/components/_modals/inventory/_shared/Hand";
import { InventoryItemInfoPanel } from "@src/components/_modals/inventory/_shared/InventoryItemInfoPanel";
import { InventoryStoragePanel } from "@src/components/_modals/inventory/_shared/InventoryStoragePanel";
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
        <InventoryStoragePanel
          owner={hero}
          inventoryType={"main"}
          className={["inventory-storage-wrapper"]}
          title={"Backpack"}
        />
        <Hand title={"Left hand"} className={"left-hand-wrapper"} inventoryType={"leftHand"} />
        <Hand title={"Right Hand"} className={"right-hand-wrapper"} inventoryType={"rightHand"} />
        <EntityOverviewPanel entity={hero} className={["entity-overview-wrapper"]} title={"Hero"} />
        <InventoryItemInfoPanel item={gameState.selectedInventoryItem} />
        <ArmorPanel />

        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
