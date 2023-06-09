import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { Fade } from "../../Fade";

export const UnitShadow = (props: { shadows: Unit["shadows"] }) => {
  return (
    <>
      {props.shadows.map((shadow, index) => {
        {
          return (
            <Fade key={index} show={!shadow.blocked || shadow.opacity <= 0}>
              <div
                className={"unit unit-shadow"}
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
