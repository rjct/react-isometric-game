import { InventoryItem } from "@src/components/_modals/inventory/InventoryItem";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";
import { useHero } from "@src/hooks/useHero";

export function Hand(props: {
  title: string;
  className: string;
  inventoryType: Exclude<keyof Unit["inventory"], "main">;
}) {
  const { hero } = useHero();
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  const inventoryItem = hero.getInventoryItems(props.inventoryType)[0];

  return (
    <fieldset className={props.className}>
      <legend className={"outlined"}>{props.title}</legend>
      <div className={"hand"} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, hero, props.inventoryType)}>
        {inventoryItem ? (
          <ul className={"unit-inventory-items-list"}>
            <InventoryItem item={inventoryItem} editable={false} draggable={true} />
          </ul>
        ) : null}
      </div>
    </fieldset>
  );
}
