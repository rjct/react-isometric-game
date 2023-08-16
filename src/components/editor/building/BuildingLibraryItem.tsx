import { DictBuilding } from "../../../engine/BuildingFactory";
import React from "react";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BuildingLibraryItem(props: { item: DictBuilding; variant: number }) {
  const [direction, setDirection] = React.useState(props.item.directions[0]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("add/entity/type", "building");
    e.dataTransfer.setData("add/entity", JSON.stringify(props.item));
    e.dataTransfer.setData("add/entity/direction", direction);
    e.dataTransfer.setData("add/entity/variant", String(props.variant));
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
            <div className={"entity-type"}>
              {props.item.type}-{props.variant}
            </div>
            <div className={"entity-size"}>
              ({props.item.size.grid.width}x{props.item.size.grid.length})
            </div>
          </div>
        </legend>

        <div className="prev-direction">
          <a
            onClick={() => {
              const index = props.item.directions.findIndex((d) => d === direction);

              const i = index - 1 < 0 ? props.item.directions.length - 1 : index - 1;

              setDirection(props.item.directions[i]);
            }}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </a>
        </div>

        <div
          className={["image", props.item.className].join(" ")}
          data-direction={direction}
          data-variant={props.variant}
        ></div>

        <div className="next-direction">
          <a
            onClick={() => {
              const index = props.item.directions.findIndex((d) => d === direction);

              const i = index + 1 > props.item.directions.length - 1 ? 0 : index + 1;

              setDirection(props.item.directions[i]);
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </a>
        </div>
      </fieldset>
    </div>
  );
}
