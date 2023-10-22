import { Button } from "@src/components/ui/Button";
import { InventoryEmptyText } from "@src/components/_modals/inventory/inventoryEmptyText";
import { InventoryItemGroup } from "@src/components/_modals/inventory/InventoryItemGroup";
import { Building } from "@src/engine/BuildingFactory";
import { GameObject } from "@src/engine/GameObjectFactory";
import { Unit } from "@src/engine/unit/UnitFactory";

export function InventoryItemsList(props: {
  owner: Unit | Building;
  inventoryType?: keyof GameObject["inventory"];
  selectable: boolean;
  editable: boolean;
  draggable: boolean;
}) {
  const inventoryEntities = props.owner.getInventoryItemsGrouped(props.inventoryType);
  const inventoryEntitiesKeys = Object.keys(inventoryEntities);

  const handleAddItemButtonClick = () => {
    //
  };

  return (
    <>
      {inventoryEntitiesKeys.length == 0 ? (
        <InventoryEmptyText />
      ) : (
        <ul className={"unit-inventory-items-list"}>
          {inventoryEntitiesKeys.map((key, index) => {
            const entitiesGroup = inventoryEntities[key];

            return (
              <InventoryItemGroup
                key={index}
                entitiesGroup={entitiesGroup}
                selectable={props.selectable}
                draggable={props.draggable}
                editable={props.editable}
              />
            );
          })}
        </ul>
      )}

      {props.editable ? (
        <Button onClick={handleAddItemButtonClick} disabled>
          <label>Add item</label>
        </Button>
      ) : null}
    </>
  );
}
