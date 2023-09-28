import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { EntityOverview } from "@src/components/_modals/inventory/EntityOverview";
import { InventoryStorage } from "@src/components/_modals/inventory/InventoryStorage";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export function InventoryTransfer() {
  const { gameDispatch, uiState, uiDispatch } = useGameState();
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

  if (!checkCurrentScene(["inventoryTransfer"])) return null;

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  const handleTakeAllButtonClick = () => {
    hero.transferInventoryWithEntity?.getInventoryItems().forEach((inventoryItem) => {
      gameDispatch({
        type: "transferInventoryEntity",
        entity: inventoryItem,
        to: { unit: hero, inventoryType: "main" },
      });
    });
  };

  return (
    <FullscreenPanel overlay={true}>
      <div className={"inventory inventory-transfer"}>
        <EntityOverview
          entity={hero}
          className={["entity-overview-wrapper", "entity-overview-wrapper-left"]}
          title={"Hero"}
        />
        <InventoryStorage
          title={`Hero (${hero.getInventoryItems().length})`}
          owner={hero}
          className={["inventory-storage-wrapper", "inventory-storage-wrapper-left"]}
        />

        <div className={"transfer-controls"}>
          <Button
            onClick={handleTakeAllButtonClick}
            disabled={hero.transferInventoryWithEntity?.getInventoryItems().length === 0}
          >
            <label>Take all</label>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </div>

        <EntityOverview
          entity={hero.transferInventoryWithEntity!}
          className={["entity-overview-wrapper", "entity-overview-wrapper-right"]}
          title={hero.transferInventoryWithEntity!.type}
        />
        <InventoryStorage
          title={`${hero.transferInventoryWithEntity?.getInventoryItems().length}`}
          owner={hero.transferInventoryWithEntity!}
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
