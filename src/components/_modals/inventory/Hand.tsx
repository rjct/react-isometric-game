import { InventoryItemsList } from "@src/components/_modals/inventory/InventoryItemsList";
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

  return (
    <fieldset className={props.className}>
      <legend>{props.title}</legend>
      <div className={"hand"} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, hero, props.inventoryType)}>
        {hero.inventory[props.inventoryType] ? (
          <InventoryItemsList owner={hero} inventoryType={props.inventoryType} editable={false} draggable={true} />
        ) : null}
      </div>
    </fieldset>
  );
}
