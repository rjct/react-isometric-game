import { Fade } from "@src/components/viewport/_shared/Fade";
import { UnitShadow } from "@src/engine/unit/UnitFactory";
import React from "react";

export const UnitShadowComponent = React.memo((props: { shadow: UnitShadow }) => {
  return (
    <Fade show={!props.shadow.blocked || props.shadow.opacity <= 0}>
      <div
        className={"unit unit-shadow"}
        style={{
          transform: `rotateX(60deg) rotateZ(${props.shadow.angle}deg) scaleY(${props.shadow.length})`,
          opacity: props.shadow.opacity,
        }}
      >
        <div className="char"></div>
      </div>
    </Fade>
  );
});
