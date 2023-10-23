import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { InventoryDictEntity } from "@src/components/_modals/inventory/_shared/InventoryDictEntity";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const InventoryItem = React.memo(function UnitInventoryItemEditor(props: {
  item: Weapon | Ammo;
  compact?: boolean;
  selectable?: boolean;
  editable?: boolean;
  draggable: boolean;
  groupLength?: number;
}) {
  if (!props.item) return null;

  const { gameState, gameDispatch } = useGameState();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("inventory/item-id", props.item.id);
    e.dataTransfer.dropEffect = "move";

    e.currentTarget.classList.add("hide");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("hide");
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!props.selectable) return;

    e.stopPropagation();
    gameDispatch({ type: "setSelectedInventoryItem", item: props.item.dictEntity });
  };

  return (
    <>
      <InventoryDictEntity
        dictEntity={props.item.dictEntity}
        selected={gameState.selectedInventoryItem?.name === props.item.name}
        draggable={props.draggable}
        compact={props.compact}
        groupLength={props.groupLength}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        {props.editable ? (
          <Button
            className={["ui-button-red"]}
            vertical={true}
            onClick={() => {
              gameDispatch({ type: "deleteInventoryItem", item: props.item });
            }}
          >
            <FontAwesomeIcon size={"2xs"} icon={faTrash} />
          </Button>
        ) : null}
      </InventoryDictEntity>
    </>
  );
});
