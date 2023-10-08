import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function useDragAndDropItem() {
  const { gameState, gameDispatch } = useGameState();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, to: Unit | Building, toInventoryType: keyof Unit["inventory"]) => {
    e.preventDefault();

    const inventoryItemId = e.dataTransfer.getData("inventory/item-id");
    const inventoryItem = gameState.getItemById(inventoryItemId);

    if (inventoryItem && to.isAllowedToPutItemInInventory(inventoryItem, toInventoryType)) {
      gameDispatch({
        type: "transferInventoryItem",
        item: inventoryItem,
        to: { unit: to, inventoryType: toInventoryType },
      });
    }
  };

  return { handleDragOver, handleDrop };
}
