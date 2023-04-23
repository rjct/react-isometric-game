import { useHero } from "../../hooks/useHero";
import { InventoryItem } from "./InventoryItem";
import React from "react";
import { useDragAndDropItem } from "../../hooks/useDragAndDropItem";

export function Backpack() {
  const { hero } = useHero();
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <div className={"backpack"} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "backpack")}>
      {hero.getBackpackItems().map((item) => {
        return <InventoryItem key={item.id} inventoryType={"backpack"} item={item} />;
      })}
    </div>
  );
}
