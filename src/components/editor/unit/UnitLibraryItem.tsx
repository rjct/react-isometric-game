import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DictUnit } from "@src/engine/UnitFactory";
import React from "react";

export function UnitLibraryItem(props: { item: DictUnit }) {
  const [direction, setDirection] = React.useState("right");
  const directions = ["left", "top", "right", "bottom"];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("add/entity/type", "unit");
    e.dataTransfer.setData("add/entity/direction", direction);
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
      <fieldset>
        <legend>
          <div className="info">
            <div className={"entity-type"}>{props.item.type}</div>
            <div className={"entity-size"}>
              ({props.item.size.grid.width}x{props.item.size.grid.length})
            </div>
          </div>
        </legend>

        <div className="prev-direction">
          <a
            onClick={() => {
              const index = directions.findIndex((d) => d === direction);

              const i = index - 1 < 0 ? directions.length - 1 : index - 1;

              setDirection(directions[i]);
            }}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </a>
        </div>

        <div
          className={["unit", "image", props.item.className].join(" ")}
          data-action={"none"}
          data-direction={direction}
        >
          <div className={"char"}></div>
        </div>

        <div className="next-direction">
          <a
            onClick={() => {
              const index = directions.findIndex((d) => d === direction);

              const i = index + 1 > directions.length - 1 ? 0 : index + 1;

              setDirection(directions[i]);
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </a>
        </div>
      </fieldset>
    </div>
  );
}
