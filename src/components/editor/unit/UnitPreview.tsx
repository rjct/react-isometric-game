import { Unit } from "@src/engine/unit/UnitFactory";
import React from "react";

export const UnitPreview = React.memo((props: { unit: Unit }) => {
  return (
    <div className={"unit-preview"}>
      <div className={props.unit.className} data-rotation={props.unit.rotation.deg} data-action={props.unit.action}>
        <div className={"char"}></div>
      </div>
    </div>
  );
});
