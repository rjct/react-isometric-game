import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { EntityOverviewPanel } from "@src/components/_modals/inventory/_shared/EntityOverviewPanel";
import { InventoryDictStoragePanel } from "@src/components/_modals/inventory/_shared/InventoryDictStoragePanel";
import { InventoryItemInfoPanel } from "@src/components/_modals/inventory/_shared/InventoryItemInfoPanel";
import { InventoryStoragePanel } from "@src/components/_modals/inventory/_shared/InventoryStoragePanel";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const EntityInventoryManagerModal = React.memo(() => {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();
  const { checkEditorMode } = useEditor();

  const selectedEntity = React.useMemo(() => {
    return gameState.selectedUnit || gameState.selectedBuilding || gameState.selectedVehicle;
  }, [gameState.selectedUnit, gameState.selectedBuilding, gameState.selectedVehicle]);

  const [editorModesHistory, saveEditorModesHistory] = React.useState([uiState.editorMode]);

  React.useEffect(() => {
    const scenes = [...editorModesHistory];

    scenes.push(uiState.editorMode);

    saveEditorModesHistory(scenes);

    return () => {
      saveEditorModesHistory([]);
    };
  }, [uiState.editorMode]);

  if (!(checkCurrentScene(["editor"]) && checkEditorMode(["manageInventory"]))) return null;

  const handleClickOut = () => {
    gameDispatch({ type: "setSelectedInventoryItem", item: null });
  };

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setEditorMode", editorMode: editorModesHistory.at(-2)! });
  };

  return (
    <FullscreenPanel overlay={true} onClick={handleClickOut}>
      <div className={"modal"}>
        <div className={"modal-content inventory inventory-manager"}>
          <EntityOverviewPanel
            entity={selectedEntity}
            className={["entity-overview-wrapper", "entity-overview-wrapper-left"]}
            title={selectedEntity.constructor.name}
          />
          <InventoryStoragePanel
            title={`${selectedEntity.getInventoryItems().length}`}
            owner={selectedEntity}
            editable={false}
            className={["inventory-storage-wrapper", "inventory-storage-wrapper-left"]}
          />
          <InventoryItemInfoPanel dictEntity={gameState.selectedInventoryItem} />

          <InventoryDictStoragePanel />
        </div>

        <div className={"modal-controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
});
