import { degToRad, randomInt } from "@src/engine/helpers";

import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useHero } from "@src/hooks/useHero";
import React from "react";

function Tick(props: { angle: AngleInDegrees; className?: string; value?: number }) {
  const margin = props.value ? 20 : 0;
  const position = {
    left: `${50 - (50 - margin) * Math.sin(degToRad(props.angle))}%`,
    top: `${50 + (50 - margin) * Math.cos(props.angle * (Math.PI / 180))}%`,
  };

  const style = props.value
    ? position
    : {
        ...position,
        ...{ transform: `translate3d(-50%, 0, 0) rotate(${props.angle + 180}deg)` },
      };

  return (
    <div className={["tick", ...[props.className || ""]].join(" ")} style={style}>
      {props.value}
    </div>
  );
}

function VehicleSpeedometerTicks(props: { vehicle: Vehicle }) {
  const { vehicle } = props;

  const result: React.ReactElement[] = [];

  const config = {
    valueMin: 0,
    valueMax: vehicle.speed.max + (vehicle.speed.max / 10) * 2,
    valueStep: (vehicle.speed.max / 10) * 3,
    angleMin: 70,
    angleMax: 290,
  };

  const steps = (config.valueMax - config.valueMin) / config.valueStep;
  const angleStep = (config.angleMax - config.angleMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const value = config.valueMin + i * config.valueStep;
    const angle = config.angleMin + i * angleStep;

    if (value > 0) {
      result.push(<Tick angle={angle} value={value} className={"value"} />);
    }

    result.push(<Tick angle={angle} />);

    if (angle < config.angleMax) {
      result.push(<Tick angle={angle + angleStep / 2} className={"half"} />);
      result.push(<Tick angle={angle + angleStep / 4} className={"quarter"} />);
      result.push(<Tick angle={angle + angleStep / 2 + angleStep / 4} className={"quarter"} />);
    }
  }

  result.push(
    <div
      className={"needle"}
      style={{
        transform: `translate3d(-50%, 0px, 0px) rotate(${
          (vehicle.speed.current / (config.valueMax - config.valueMin)) * (config.angleMax - config.angleMin) +
          config.angleMin +
          randomInt(-3, 3)
        }deg)`,
      }}
    ></div>,
  );

  return <>{result}</>;
}

function addLeadingZeros(num: number, length: number): string {
  const numString = String(num);
  const zerosToAdd = length - numString.length;

  if (zerosToAdd <= 0) {
    return numString;
  }

  const zeros: string = "0".repeat(zerosToAdd);
  return zeros + numString;
}

export const VehicleDashboard = () => {
  const { hero } = useHero();

  if (!hero.isVehicleInUse()) return null;

  const vehicle = hero.getVehicleInUse()!;

  return (
    <div className={"control-vehicle"}>
      <div className={"vehicle-speedometer-wrapper"}>
        <div className={"vehicle-speedometer"}>
          <VehicleSpeedometerTicks vehicle={vehicle} />
          <div className={"needle-axle"}></div>
          <div className={"tachometer"}>{addLeadingZeros(Math.round(vehicle.pathQueue.totalDistMoved / 10), 7)}</div>
        </div>
      </div>
    </div>
  );
};
