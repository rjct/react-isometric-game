import { StatRow } from "@src/components/_modals/unit_characteristics/StatRow";
import { Unit } from "@src/engine/unit/UnitFactory";

export function DerivedStats(props: { unit: Unit }) {
  return (
    <fieldset className={"unit-derived-wrapper"}>
      <div className={"body"}>
        {Object.values(props.unit.characteristics.derived).map((stat) => (
          <StatRow key={stat.name} stat={stat} />
        ))}
      </div>
    </fieldset>
  );
}
