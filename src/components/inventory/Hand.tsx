import { Unit } from "../../engine/UnitFactory";
import React from "react";
import { useHero } from "../../hooks/useHero";
import { InventoryItem } from "./InventoryItem";
import { useDragAndDropItem } from "../../hooks/useDragAndDropItem";

export function Hand(props: { inventoryType: Exclude<keyof Unit["inventory"], "backpack"> }) {
  const { hero } = useHero();
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <div className={"hand"} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, props.inventoryType)}>
      {hero.inventory[props.inventoryType] ? (
        <InventoryItem inventoryType={props.inventoryType} item={hero.inventory[props.inventoryType]!} />
      ) : null}
    </div>
  );
}
