import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export function useDragAndDropItem() {
  const { hero } = useHero();
  const { gameDispatch } = useGameState();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toInventoryType: keyof Unit["inventory"]) => {
    e.preventDefault();

    const fromInventoryType = e.dataTransfer.getData("inventory/type") as keyof Unit["inventory"];
    const itemId = e.dataTransfer.getData("inventory/item-id");

    const entity = hero.getInventoryItemById(itemId);

    if (entity && hero.isAllowedToPutItemInInventory(toInventoryType)) {
      gameDispatch({
        type: "transferInventoryEntity",
        entity,
        from: { unit: hero, inventoryType: fromInventoryType },
        to: { unit: hero, inventoryType: toInventoryType },
      });
    }
  };

  return { handleDragOver, handleDrop };
}
