import { InventoryEmptyText } from "@src/components/_modals/inventory/inventoryEmptyText";
import { InventoryItem } from "@src/components/_modals/inventory/InventoryItem";
import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";

export function InventoryItemsList(props: {
  owner: Unit | Building;
  inventoryType?: keyof Unit["inventory"] | keyof Building["inventory"];
  editable: boolean;
  draggable: boolean;
}) {
  const inventoryEntities = props.inventoryType
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      props.owner.inventory[props.inventoryType]
    : props.owner.getInventoryItems();

  return (
    <ul className={"unit-inventory-items-list"}>
      {inventoryEntities && Array.isArray(inventoryEntities) ? (
        inventoryEntities.length > 0 ? (
          inventoryEntities.map((entity) => (
            <InventoryItem
              key={entity.id}
              entity={entity}
              inventoryType={props.owner.findInventoryEntityPlaceType(entity)!}
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
          inventoryType={props.owner.findInventoryEntityPlaceType(inventoryEntities)!}
          editable={props.editable}
          draggable={props.draggable}
        />
      ) : (
        <InventoryEmptyText />
      )}
    </ul>
  );
}
