import { DictBuilding } from "../../../engine/BuildingFactory";
import React from "react";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputRange } from "../_shared/InputRange";

export function BuildingLibraryItem(props: { item: DictBuilding }) {
  const [direction, setDirection] = React.useState(props.item.directions[0]);
  const [variant, setVariant] = React.useState(0);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("add/entity/type", "building");
    e.dataTransfer.setData("add/entity", JSON.stringify(props.item));
    e.dataTransfer.setData("add/entity/direction", direction);
    e.dataTransfer.setData("add/entity/variant", String(variant));
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
      <div
        className={["image", props.item.className].join(" ")}
        data-direction={direction}
        data-variant={variant}
      ></div>
      <div
        className="variant"
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        draggable={true}
      >
        <InputRange
          initialValue={0}
          valueSuffix={""}
          min={0}
          max={[...Array(props.item.variants).keys()].length - 1}
          onChange={(variant) => setVariant(variant)}
        />
      </div>
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
      <div className="info">
        <div className={"entity-type"}>{props.item.type}</div>
        <div className={"entity-size"}>
          {props.item.size.grid.width}x{props.item.size.grid.length}
        </div>
      </div>
    </div>
  );
}
