import { InventoryItemsList } from "@src/components/inventory/InventoryItemsList";
import { Unit } from "@src/engine/UnitFactory";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";
import { useHero } from "@src/hooks/useHero";

export function Hand(props: {
  title: string;
  className: string;
  inventoryType: Exclude<keyof Unit["inventory"], "backpack">;
}) {
  const { hero } = useHero();
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <fieldset className={props.className}>
      <legend>{props.title}</legend>
      <div className={"hand"} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, props.inventoryType)}>
        {hero.inventory[props.inventoryType] ? (
          <InventoryItemsList unit={hero} inventoryType={props.inventoryType} editable={false} draggable={true} />
        ) : null}
      </div>
    </fieldset>
  );
}
