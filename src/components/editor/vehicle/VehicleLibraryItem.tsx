import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VehicleDictEntity } from "@src/dict/vehicle/_vehicle";
import React from "react";

export function VehicleLibraryItem(props: { item: VehicleDictEntity }) {
  const [rotation, setRotation] = React.useState<AngleInDegrees>(0);
  const rotationAngles = [0, 45, 90, 135, 180, 225, 270];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("add/entity/type", "vehicle");
    e.dataTransfer.setData("add/entity/rotation", String(rotation));
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
              const index = rotationAngles.findIndex((d) => d === rotation);

              const i = index - 1 < 0 ? rotationAngles.length - 1 : index - 1;

              setRotation(rotationAngles[i]);
            }}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </a>
        </div>

        <div
          className={["vehicle", "image", props.item.className].join(" ")}
          data-action={"none"}
          data-rotation={rotation}
        ></div>

        <div className="next-direction">
          <a
            onClick={() => {
              const index = rotationAngles.findIndex((d) => d === rotation);

              const i = index + 1 > rotationAngles.length - 1 ? 0 : index + 1;

              setRotation(rotationAngles[i]);
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </a>
        </div>
      </fieldset>
    </div>
  );
}
