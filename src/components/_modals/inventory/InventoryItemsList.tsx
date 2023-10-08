import { InventoryItemGroup } from "@src/components/_modals/inventory/InventoryItemGroup";
import { Building } from "@src/engine/BuildingFactory";
import { GameObject } from "@src/engine/GameObjectFactory";
import { Unit } from "@src/engine/unit/UnitFactory";

export function InventoryItemsList(props: {
  owner: Unit | Building;
  inventoryType?: keyof GameObject["inventory"];
  editable: boolean;
  draggable: boolean;
}) {
  const inventoryEntities = props.owner.getInventoryItemsGrouped(props.inventoryType);

  return (
    <ul className={"unit-inventory-items-list"}>
      {Object.keys(inventoryEntities).map((key, index) => {
        const entitiesGroup = inventoryEntities[key];

        return (
          <InventoryItemGroup
            key={index}
            entitiesGroup={entitiesGroup}
            draggable={props.draggable}
            editable={props.editable}
          />
        );
      })}
    </ul>
  );
}
