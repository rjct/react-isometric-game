import React from "react";
import { Unit } from "../engine/UnitFactory";
import { useHero } from "./useHero";
import { useGameState } from "./useGameState";

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

    const item = hero.getInventoryItemById(itemId);

    if (item && hero.isAllowedToPutItemInInventory(toInventoryType)) {
      gameDispatch({
        type: "transferItem",
        item,
        from: { unit: hero, inventoryType: fromInventoryType },
        to: { unit: hero, inventoryType: toInventoryType },
      });
    }
  };

  return { handleDragOver, handleDrop };
}
