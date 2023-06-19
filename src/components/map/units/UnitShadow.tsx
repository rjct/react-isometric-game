import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { Fade } from "../../Fade";

export const UnitShadow = (props: { unit: Unit }) => {
  return (
    <>
      {props.unit.shadows.map((shadow, index) => {
        {
          return (
            <Fade key={index} show={!shadow.blocked || shadow.opacity <= 0}>
              <div
                data-direction={props.unit.direction}
                data-action={props.unit.action}
                data-weapon={props.unit.getCurrentWeapon()?.className}
                className={`${props.unit.className} unit-shadow`}
                style={{
                  transform: `rotateX(60deg) rotateZ(${shadow.angle}deg) scaleY(${shadow.width})`,
                  opacity: shadow.opacity,
                }}
              >
                <div className="char"></div>
              </div>
            </Fade>
          );
        }
      })}
    </>
  );
};
