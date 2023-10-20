import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const InventoryItem = React.memo(function UnitInventoryItemEditor(props: {
  item: Weapon | Ammo;
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
    e.stopPropagation();
    gameDispatch({ type: "setSelectedInventoryItem", item: props.item });
  };

  const isGroup = (props.groupLength || 0) > 1;

  return (
    <li
      className={[
        isGroup ? "group-item-list" : "",
        gameState.selectedInventoryItem?.id === props.item.id ? "selected" : "",
      ].join(" ")}
      draggable={props.draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      {isGroup ? <div className={"entities-group-count"}>x{props.groupLength}</div> : null}
      <div className={`inventory-item-pic`} data-name={[props.item.name]}></div>
      <div className={"entity-title-wrapper"}>
        <div className={"entity-title"}>{props.item.dictEntity.title}</div>
      </div>

      {props.editable ? (
        <Button
          className={["ui-button-red"]}
          vertical={true}
          onClick={() => {
            gameDispatch({ type: "deleteInventoryItem", item: props.item });
          }}
        >
          <FontAwesomeIcon size={"xs"} icon={faTrash} />
        </Button>
      ) : null}
    </li>
  );
});
