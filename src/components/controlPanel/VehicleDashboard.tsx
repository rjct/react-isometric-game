import { degToRad, randomInt } from "@src/engine/helpers";

import { useHero } from "@src/hooks/useHero";
import React from "react";

type SpeedometerConfig = {
  valueMax: number;
  valueStep: number;
  angleMin: number;
  angleMax: number;
};

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

function VehicleSpeedometerTicks(props: { config: SpeedometerConfig }) {
  const result: React.ReactElement[] = [];

  const steps = props.config.valueMax / props.config.valueStep;
  const angleStep = (props.config.angleMax - props.config.angleMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const value = i * props.config.valueStep;
    const angle = props.config.angleMin + i * angleStep;

    if (value > 0) {
      result.push(<Tick key={`value-${i}`} angle={angle} value={value} className={"value"} />);
    }

    result.push(<Tick key={i} angle={angle} />);

    if (angle < props.config.angleMax) {
      result.push(<Tick key={`tick-half-${i}`} angle={angle + angleStep / 2} className={"half"} />);
      result.push(<Tick key={`tick-quarter-${i}`} angle={angle + angleStep / 4} className={"quarter"} />);
      result.push(
        <Tick key={`tick-quarter-2-value-${i}`} angle={angle + angleStep / 2 + angleStep / 4} className={"quarter"} />,
      );
    }
  }

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

  const vehicle = hero.getVehicleInUse()!;

  const [needleShakeDeg, setNeedleShakeDeg] = React.useState(0);

  React.useEffect(() => {
    if (!vehicle) return;

    const interval = setInterval(() => setNeedleShakeDeg(randomInt(-3, 3)), 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!hero.isVehicleInUse()) return null;

  const config = {
    valueMax: vehicle.speed.max + (vehicle.speed.max / 10) * 2,
    valueStep: (vehicle.speed.max / 10) * 3,
    angleMin: 70,
    angleMax: 290,
  };

  return (
    <div className={"control-vehicle"}>
      <div className={"vehicle-speedometer-wrapper"}>
        <div className={"vehicle-speedometer"}>
          <VehicleSpeedometerTicks config={config} />
          <div className={"needle-axle"}></div>
          <div className={"tachometer"}>{addLeadingZeros(Math.round(vehicle.pathQueue.totalDistMoved / 10), 7)}</div>

          <div
            className={"needle"}
            key={needleShakeDeg}
            style={{
              transform: `translate3d(-50%, 0px, 0px) rotate(${
                (vehicle.speed.current / config.valueMax) * (config.angleMax - config.angleMin) +
                config.angleMin +
                needleShakeDeg
              }deg)`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
