import React from "react";
import { DictUnit } from "../../../engine/UnitFactory";

export function UnitLibraryItem(props: { item: DictUnit }) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("add/entity/type", "unit");
    e.dataTransfer.setData("add/entity", JSON.stringify(props.item));
    e.dataTransfer.dropEffect = "move";

    const elem = e.currentTarget.getElementsByClassName("image")[0];
    const rect = elem.getBoundingClientRect();

    e.dataTransfer.setDragImage(elem, rect.width / 2, rect.height);

    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("dragging");
  };

  return (
    <div className={"library-entity"} draggable={true} onDragStart={handleDragStart} onDragOver={handleDragOver}>
      <div className={["unit", "image", props.item.className].join(" ")} data-action={"none"} data-direction={"right"}>
        <div className={"char"}></div>
      </div>

      <div className="info">
        <div className={"entity-type"}>{props.item.type}</div>
        <div className={"entity-size"}>
          {props.item.size.grid.width}x{props.item.size.grid.length}
        </div>
      </div>
    </div>
  );
}
