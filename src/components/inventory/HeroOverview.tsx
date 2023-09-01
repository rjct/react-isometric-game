import { useHero } from "@src/hooks/useHero";

export function HeroOverview() {
  const { hero } = useHero();

  return (
    <fieldset className={"hero-overview-wrapper"}>
      <legend>Hero</legend>
      <div className="unit-preview">
        <div className={["unit", hero.className].join(" ")} data-direction={hero.direction} data-action="none">
          <div className="char"></div>
        </div>
      </div>
    </fieldset>
  );
}
