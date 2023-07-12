import { Unit } from "../../engine/UnitFactory";

export function HeroPoints(props: { points: Unit["healthPoints"] | Unit["actionPoints"] }) {
  const { current, max } = props.points;

  const currentPercent = (current / max) * 100;
  const warnPercent = 50;
  const criticalPercent = 20;
  const className = currentPercent <= criticalPercent ? "critical" : currentPercent <= warnPercent ? "warn" : "";

  return (
    <div className={"points-wrapper"}>
      <span className={"value"}>
        <span className={className}>{current}</span> / <span>{max}</span>
      </span>

      <div className={"progress"}>
        <div className={"progress-value"} style={{ width: `${currentPercent}%` }}></div>
      </div>
    </div>
  );
}
