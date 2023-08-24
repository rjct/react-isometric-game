import { Weapon } from "../../engine/weapon/WeaponFactory";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { useGameState } from "../../hooks/useGameState";
import { Unit } from "../../engine/UnitFactory";
import { Button } from "../ui/Button";

export const InventoryItem = React.memo(function UnitInventoryItemEditor(props: {
  entity: Weapon;
  inventoryType: keyof Unit["inventory"];
  editable: boolean;
  draggable: boolean;
}) {
  if (!props.entity) return null;

  const { gameDispatch } = useGameState();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("inventory/type", props.inventoryType);
    e.dataTransfer.setData("inventory/item-id", props.entity.id);
    e.dataTransfer.dropEffect = "move";

    e.currentTarget.classList.add("hide");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("hide");
  };

  return (
    <li draggable={props.draggable} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`weapon-pic ${props.entity.className}`}></div>
      <div className={"entity-title-wrapper"}>
        <div className={"entity-title"}>{props.entity.title}</div>
        <div className={"entity-subtitle"}>
          AP: {props.entity.actionPointsConsumption}
          <br />
          Distance: {props.entity.range}
        </div>
      </div>

      {props.editable ? (
        <Button
          className={["ui-button-red"]}
          vertical={true}
          onClick={() => {
            gameDispatch({ type: "deleteInventoryEntity", entity: props.entity });
          }}
        >
          <FontAwesomeIcon size={"xs"} icon={faTrash} />
        </Button>
      ) : null}
    </li>
  );
});
