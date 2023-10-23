import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { EntityOverviewPanel } from "@src/components/_modals/inventory/_shared/EntityOverviewPanel";
import { InventoryItemInfoPanel } from "@src/components/_modals/inventory/_shared/InventoryItemInfoPanel";
import { InventoryStoragePanel } from "@src/components/_modals/inventory/_shared/InventoryStoragePanel";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export function InventoryTransfer() {
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

  const inventoryItems = React.useMemo(() => {
    return gameState.selectedEntityForInventoryTransfer?.getInventoryItems() || [];
  }, [gameState.selectedEntityForInventoryTransfer, gameState.selectedEntityForInventoryTransfer?.getInventoryItems()]);

  if (!checkCurrentScene(["inventoryTransfer"])) return null;

  const handleCloseButtonClick = () => {
    gameDispatch({ type: "highlightExplorableEntity", entity: null });
    gameDispatch({ type: "setSelectedEntityForInventoryTransfer", entity: null });
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  const handleTakeAllButtonClick = () => {
    inventoryItems.forEach((inventoryItem) => {
      gameDispatch({
        type: "transferInventoryItem",
        item: inventoryItem,
        to: { unit: hero, inventoryType: "main" },
      });
    });
  };

  const handleClickOut = () => {
    gameDispatch({ type: "setSelectedInventoryItem", item: null });
  };

  return (
    <FullscreenPanel overlay={true} onClick={handleClickOut}>
      <div className={"inventory inventory-transfer"}>
        <EntityOverviewPanel
          entity={hero}
          className={["entity-overview-wrapper", "entity-overview-wrapper-left"]}
          title={"Hero"}
        />
        <InventoryStoragePanel
          title={`Hero (${hero.getInventoryItems().length})`}
          owner={hero}
          className={["inventory-storage-wrapper", "inventory-storage-wrapper-left"]}
        />

        <InventoryItemInfoPanel item={gameState.selectedInventoryItem} />

        <div className={"transfer-controls"}>
          <Button onClick={handleTakeAllButtonClick} disabled={inventoryItems.length === 0}>
            <label>Take all{inventoryItems.length > 0 ? ` (${inventoryItems.length})` : ``}</label>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </div>

        <EntityOverviewPanel
          entity={gameState.selectedEntityForInventoryTransfer!}
          className={["entity-overview-wrapper", "entity-overview-wrapper-right"]}
          title={gameState.selectedEntityForInventoryTransfer!.type}
        />
        <InventoryStoragePanel
          title={`${inventoryItems.length}`}
          owner={gameState.selectedEntityForInventoryTransfer!}
          className={["inventory-storage-wrapper", "inventory-storage-wrapper-right"]}
        />

        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
