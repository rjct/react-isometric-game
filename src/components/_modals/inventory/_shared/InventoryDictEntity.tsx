import { ItemImage } from "@src/components/_modals/inventory/_shared/ItemImage";
import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";
import React from "react";

export const InventoryDictEntity = (props: {
  children?: React.ReactNode;
  dictEntity: WeaponDictEntity | AmmoDictEntity;
  selected?: boolean;
  draggable?: boolean;
  compact?: boolean;
  groupLength?: number;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const isGroup = (props.groupLength || 0) > 1;

  return (
    <li
      title={props.dictEntity.title}
      className={[isGroup ? "group-item-list" : "", props.selected ? "selected" : ""].join(" ")}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onClick={props.onClick}
    >
      {isGroup ? <div className={"entities-group-count"}>x{props.groupLength}</div> : null}
      <ItemImage dictEntity={props.dictEntity} />

      {props.compact ? (
        <div className={"inventory-item-title-wrapper"}>
          <div className={"inventory-item-title-title"}>{props.dictEntity.title}</div>
        </div>
      ) : null}

      {props.children}
    </li>
  );
};
