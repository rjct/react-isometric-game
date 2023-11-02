import { InventoryDictEntity } from "@src/components/_modals/inventory/_shared/InventoryDictEntity";
import getAmmoDictList, { AmmoDictEntity } from "@src/dict/ammo/ammo";
import getWeaponDictList, { WeaponDictEntity } from "@src/dict/weapon/weapon";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const InventoryDictStoragePanel = React.memo(() => {
  const { gameState, gameDispatch } = useGameState();

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

  const dictEntities = Object.values({ ...getWeaponDictList(), ...getAmmoDictList(true) });

  return (
    <fieldset className={"inventory-storage-wrapper inventory-storage-wrapper-right"} data-droppable={true}>
      <legend className={"outlined"}>ALL INVENTORY ITEMS</legend>
      <div className={".inventory-storage-wrapper"}>
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
      </div>
    </fieldset>
  );
});
