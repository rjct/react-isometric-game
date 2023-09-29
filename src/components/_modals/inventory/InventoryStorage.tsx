import { InventoryItemsList } from "@src/components/_modals/inventory/InventoryItemsList";
import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";

export function InventoryStorage(props: {
  owner: Unit | Building;
  className: string[];
  title: string;
  inventoryType?: keyof Unit["inventory"];
}) {
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <fieldset className={props.className.join(" ")}>
      <legend>{props.title}</legend>
      <div
        className={"inventory-storage"}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, props.owner, "main")}
      >
        <InventoryItemsList owner={props.owner} inventoryType={props.inventoryType} editable={false} draggable={true} />
      </div>
    </fieldset>
  );
}