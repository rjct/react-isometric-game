export function HeroPoints(props: {
  style?: "red";
  title: string;
  shortTitle: string;
  label: { value: number; max?: number };
  progress: { value: number; max: number };
  warnPercent: number;
  criticalPercent: number;
}) {
  const currentPercent = (props.progress.value / props.progress.max) * 100;
  const className =
    currentPercent <= props.criticalPercent ? "critical" : currentPercent <= props.warnPercent ? "warn" : "";

  return (
    <>
      <legend>{props.title}</legend>
      <legend className={"short"} title={props.title}>
        {props.shortTitle}
      </legend>

      <div className={["points-wrapper", props.style === "red" ? "color-red" : ""].join(" ")}>
        <span className={"value blink-white"} key={props.label.value}>
          <span className={className}>{props.label.value}</span>
          {props.label.max ? <span> / {props.label.max}</span> : null}
        </span>

        <div className={"progress"}>
          <div className={"progress-value"} style={{ width: `${currentPercent}%` }}></div>
        </div>
      </div>
    </>
  );
}
