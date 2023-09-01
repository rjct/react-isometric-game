import { InventoryItemsList } from "@src/components/inventory/InventoryItemsList";
import { useDragAndDropItem } from "@src/hooks/useDragAndDropItem";
import { useHero } from "@src/hooks/useHero";

export function Backpack() {
  const { hero } = useHero();
  const { handleDrop, handleDragOver } = useDragAndDropItem();

  return (
    <fieldset className={"backpack-wrapper"}>
      <legend>Backpack ({hero.getBackpackItems().length})</legend>
      <div className={"backpack"} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "backpack")}>
        <InventoryItemsList unit={hero} inventoryType={"backpack"} editable={false} draggable={true} />
      </div>
    </fieldset>
  );
}
