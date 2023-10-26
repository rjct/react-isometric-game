import { InventoryItemsList } from "@src/components/_modals/inventory/_shared/InventoryItemsList";
import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";

export function InventoryStoragePanel(props: {
  owner: Unit | Building | Vehicle;
  className: string[];
  title: string;
  inventoryType?: keyof Unit["inventory"];
  editable: boolean;
  compact?: boolean;
}) {
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <fieldset className={props.className.join(" ")} data-droppable={true}>
      <legend className={"outlined"}>{props.title}</legend>
      <div
        className={"inventory-storage"}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, props.owner, "main")}
      >
        <InventoryItemsList
          owner={props.owner}
          inventoryType={props.inventoryType}
          selectable={true}
          editable={props.editable}
          draggable={true}
          compact={props.compact}
        />
      </div>

      <div className={"inventory-storage-info"}>
        Total weight: {props.owner.getInventoryItemsWeight(props.inventoryType)}
      </div>
    </fieldset>
  );
}
