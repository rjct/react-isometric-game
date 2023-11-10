import { Unit } from "@src/engine/unit/UnitFactory";

export function HeroPoints(props: {
  points: Unit["characteristics"]["derived"]["healthPoints"] | Unit["characteristics"]["derived"]["actionPoints"];
  title: string;
  shortTitle: string;
}) {
  const { value, max } = props.points;

  const currentPercent = (value / max) * 100;
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
          <span className={className}>{value}</span> / <span>{max}</span>
        </span>

        <div className={"progress"}>
          <div className={"progress-value"} style={{ width: `${currentPercent}%` }}></div>
        </div>
      </div>
    </>
  );
}
