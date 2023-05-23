import { Firearm } from "../../engine/weapon/FirearmFactory";
import React from "react";
import { Unit } from "../../engine/UnitFactory";

export function InventoryItem(props: { inventoryType: keyof Unit["inventory"]; item: Firearm }) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("inventory/type", props.inventoryType);
    e.dataTransfer.setData("inventory/item-id", props.item.id);
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div>
      <div
        className={["item", "weapon-pic", props.item.className].join(" ")}
        draggable={"true"}
        onDragStart={handleDragStart}
      >
        {props.item.title}
      </div>
    </div>
  );
}
