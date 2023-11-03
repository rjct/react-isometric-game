import { InventoryDictEntity } from "@src/components/_modals/inventory/_shared/InventoryDictEntity";
import { InventoryItemsFilterControl } from "@src/components/_modals/inventory/_shared/InventoryItemsFilterControl";
import getAmmoDictList, { AmmoDictEntity } from "@src/dict/ammo/ammo";
import getWeaponDictList, { WeaponDictEntity } from "@src/dict/weapon/weapon";
import { InventoryItemClass } from "@src/engine/InventoryItemFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const InventoryDictStoragePanel = React.memo(() => {
  const { gameState, gameDispatch } = useGameState();

  const [filter, setFilter] = React.useState<InventoryItemClass | undefined>();

  const handleItemClick = (e: React.MouseEvent, dictEntity: WeaponDictEntity | AmmoDictEntity) => {
    e.stopPropagation();
    gameDispatch({ type: "setSelectedInventoryItem", item: dictEntity });
  };

  const handleDragStart = (e: React.DragEvent, dictEntity: WeaponDictEntity | AmmoDictEntity) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item-transfer-mode", "create-new");
    e.dataTransfer.setData("inventory/item-id", dictEntity.name.toString());
    e.dataTransfer.dropEffect = "move";
  };

  const getDictEntities = () => {
    const weapon = { ...getWeaponDictList() };
    const ammo = { ...getAmmoDictList(true) };

    switch (filter) {
      case "weapon":
        return weapon;

      case "ammo":
        return ammo;

      default:
        return { ...weapon, ...ammo };
    }
  };

  const dictEntities = React.useMemo(() => Object.values(getDictEntities()), [filter]);

  return (
    <fieldset className={"inventory-storage-wrapper inventory-storage-wrapper-right"} data-droppable={true}>
      <legend className={"outlined"}>ALL INVENTORY ITEMS</legend>

      <div className={"inventory-storage-controls"}>
        <InventoryItemsFilterControl value={filter} onChange={setFilter} />
      </div>

      <div className={"inventory-storage"}>
        <ul className={"unit-inventory-items-list"}>
          {dictEntities.map((dictEntity) => (
            <InventoryDictEntity
              key={dictEntity.name}
              dictEntity={dictEntity}
              selected={gameState.selectedInventoryItem?.name === dictEntity.name}
              draggable={true}
              compact={false}
              onClick={(e) => handleItemClick.call(this, e, dictEntity)}
              onDragStart={(e) => handleDragStart.call(this, e, dictEntity)}
            />
          ))}
        </ul>
      </div>
    </fieldset>
  );
});
