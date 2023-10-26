import { InventoryEmptyText } from "@src/components/_modals/inventory/_shared/inventoryEmptyText";
import { InventoryItem } from "@src/components/_modals/inventory/_shared/InventoryItem";
import { Building } from "@src/engine/BuildingFactory";
import { GameObject } from "@src/engine/GameObjectFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export function InventoryItemsList(props: {
  owner: Unit | Building | Vehicle;
  inventoryType?: keyof GameObject["inventory"];
  compact?: boolean;
  selectable: boolean;
  editable: boolean;
  draggable: boolean;
}) {
  const inventoryEntities = props.owner.getInventoryItemsGrouped(props.inventoryType);
  const inventoryEntitiesKeys = Object.keys(inventoryEntities);

  return (
    <>
      {inventoryEntitiesKeys.length == 0 ? (
        <InventoryEmptyText />
      ) : (
        <ul className={`unit-inventory-items-list ${props.compact ? "unit-inventory-items-list--compact" : ""}`}>
          {inventoryEntitiesKeys.map((key) => {
            const entitiesGroup = inventoryEntities[key];

            return <InventoryItem key={key} item={entitiesGroup[0]} groupLength={entitiesGroup.length} {...props} />;
          })}
        </ul>
      )}
    </>
  );
}
