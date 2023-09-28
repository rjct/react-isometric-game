import { InventoryItemsList } from "@src/components/_modals/inventory/InventoryItemsList";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";

export function Backpack(props: { owner: Unit }) {
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <fieldset className={"inventory-storage-wrapper"}>
      <legend>Backpack ({props.owner.getBackpackItems().length})</legend>
      <div
        className={"inventory-storage"}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, props.owner, "main")}
      >
        <InventoryItemsList owner={props.owner} inventoryType={"main"} editable={false} draggable={true} />
      </div>
    </fieldset>
  );
}
