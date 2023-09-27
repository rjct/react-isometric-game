import { Unit } from "@src/engine/unit/UnitFactory";

export function HeroPoints(props: {
  points: Unit["healthPoints"] | Unit["actionPoints"];
  title: string;
  shortTitle: string;
}) {
  const { current, max } = props.points;

  const currentPercent = (current / max) * 100;
  const warnPercent = 50;
  const criticalPercent = 20;
  const className = currentPercent <= criticalPercent ? "critical" : currentPercent <= warnPercent ? "warn" : "";

  return (
    <>
      <legend>{props.title}</legend>
      <legend className={"short"} title={props.title}>
        {props.shortTitle}
      </legend>

      <div className={"points-wrapper"}>
        <span className={"value"}>
          <span className={className}>{current}</span> / <span>{max}</span>
        </span>

        <div className={"progress"}>
          <div className={"progress-value"} style={{ width: `${currentPercent}%` }}></div>
        </div>
      </div>
    </>
  );
}
