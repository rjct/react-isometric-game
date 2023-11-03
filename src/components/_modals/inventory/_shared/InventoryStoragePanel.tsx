import { InventoryItemsFilterControl } from "@src/components/_modals/inventory/_shared/InventoryItemsFilterControl";
import { InventoryItemsList } from "@src/components/_modals/inventory/_shared/InventoryItemsList";
import { Building } from "@src/engine/building/BuildingFactory";
import { InventoryItemClass, inventoryItemClasses } from "@src/engine/InventoryItemFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";
import React from "react";

export function InventoryStoragePanel(props: {
  owner: Unit | Building | Vehicle;
  className: string[];
  title: string;
  inventoryType?: keyof Unit["inventory"];
  editable: boolean;
  compact?: boolean;
}) {
  const { handleDrop, handleDragOver } = useDragAndDropItem();
  const [filter, setFilter] = React.useState<InventoryItemClass | undefined>();

  const inventoryItemsGrouped = props.owner.getInventoryItemsGrouped(props.inventoryType, filter);

  return (
    <fieldset className={props.className.join(" ")} data-droppable={true}>
      <legend className={"outlined"}>{props.title}</legend>

      <div className={"inventory-storage-controls"}>
        <InventoryItemsFilterControl
          value={filter}
          itemsCount={Object.entries(inventoryItemClasses).reduce(
            (_, currentValue) => {
              const [k] = currentValue;
              const key = k as InventoryItemClass;

              if (!_[key as InventoryItemClass]) {
                _[key] = 0;
              }

              if (inventoryItemsGrouped[key]) {
                _[key] = inventoryItemsGrouped[key].count;
              }

              return _;
            },
            {} as { [p in InventoryItemClass]: number },
          )}
          onChange={setFilter}
        />
      </div>

      <div
        className={"inventory-storage"}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, props.owner, "main")}
      >
        <InventoryItemsList
          inventoryItems={inventoryItemsGrouped}
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
