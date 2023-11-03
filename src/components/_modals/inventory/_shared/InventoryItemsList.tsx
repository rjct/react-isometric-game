import { InventoryEmptyText } from "@src/components/_modals/inventory/_shared/inventoryEmptyText";
import { InventoryItem } from "@src/components/_modals/inventory/_shared/InventoryItem";
import { InventoryItemClass, InventoryItemClassGroup } from "@src/engine/InventoryItemFactory";

export function InventoryItemsList(props: {
  inventoryItems: InventoryItemClassGroup;
  compact?: boolean;
  selectable: boolean;
  editable: boolean;
  draggable: boolean;
}) {
  const inventoryEntities = props.inventoryItems;
  const inventoryEntitiesKeys = inventoryEntities ? (Object.keys(inventoryEntities) as InventoryItemClass[]) : [];

  if (!inventoryEntities || inventoryEntitiesKeys.length === 0) return <InventoryEmptyText />;

  return (
    <ul className={`unit-inventory-items-list ${props.compact ? "unit-inventory-items-list--compact" : ""}`}>
      {inventoryEntitiesKeys.map((inventoryItemClass) => {
        return Object.values(inventoryEntities[inventoryItemClass].items).map((group) => {
          return group.length > 0 ? (
            <InventoryItem key={group[0].id} item={group[0]} groupLength={group.length} {...props} />
          ) : null;
        });
      })}
    </ul>
  );
}
