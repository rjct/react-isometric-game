import { InventoryEmptyText } from "@src/components/inventory/inventoryEmptyText";
import { InventoryItem } from "@src/components/inventory/InventoryItem";
import { Unit } from "@src/engine/unit/UnitFactory";

export function InventoryItemsList(props: {
  unit: Unit;
  inventoryType: keyof Unit["inventory"];
  editable: boolean;
  draggable: boolean;
}) {
  const inventoryEntities = props.unit.inventory[props.inventoryType];

  return (
    <ul className={"unit-inventory-items-list"}>
      {inventoryEntities && Array.isArray(inventoryEntities) ? (
        inventoryEntities.length > 0 ? (
          inventoryEntities.map((entity) => (
            <InventoryItem
              key={entity.id}
              entity={entity}
              inventoryType={props.inventoryType}
              editable={props.editable}
              draggable={props.draggable}
            />
          ))
        ) : (
          <InventoryEmptyText />
        )
      ) : inventoryEntities ? (
        <InventoryItem
          entity={inventoryEntities}
          inventoryType={props.inventoryType}
          editable={props.editable}
          draggable={props.draggable}
        />
      ) : (
        <InventoryEmptyText />
      )}
    </ul>
  );
}
