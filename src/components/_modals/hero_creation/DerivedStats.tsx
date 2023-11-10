import { StatRow } from "@src/components/_modals/hero_creation/StatRow";
import { useHero } from "@src/hooks/useHero";

export function DerivedStats() {
  const { hero } = useHero();

  return (
    <fieldset className={"unit-derived-wrapper"}>
      <div className={"body"}>
        {Object.values(hero.characteristics.derived).map((stat) => (
          <StatRow key={stat.name} stat={stat} />
        ))}
      </div>
    </fieldset>
  );
}
