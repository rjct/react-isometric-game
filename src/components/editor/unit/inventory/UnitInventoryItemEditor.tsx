import { Weapon } from "../../../../engine/weapon/WeaponFactory";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { useGameState } from "../../../../hooks/useGameState";

export const UnitInventoryItemEditor = React.memo(function UnitInventoryItemEditor(props: { entity: Weapon }) {
  if (!props.entity) return null;

  const { gameDispatch } = useGameState();

  return (
    <li>
      <div className={`weapon-pic ${props.entity.className}`}></div>
      <div className={"entity-title-wrapper"}>
        <div className={"entity-title"}>{props.entity.title}</div>
        <div className={"entity-subtitle"}>
          AP: {props.entity.actionPointsConsumption}
          <br />
          Distance: {props.entity.range}
        </div>
      </div>
      <button
        className={"ui-button ui-button-red"}
        onClick={() => {
          gameDispatch({ type: "deleteInventoryEntity", entity: props.entity });
        }}
      >
        <FontAwesomeIcon size={"xs"} icon={faTrash} />
      </button>
    </li>
  );
});
