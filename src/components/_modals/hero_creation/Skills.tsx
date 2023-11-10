import { Button } from "@src/components/ui/Button";
import { LabelWithValue } from "@src/components/ui/LabelWithValue";
import { StatRow } from "@src/components/_modals/hero_creation/StatRow";
import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";

export function Skills() {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  const handlePointsChangeClick = (key: UnitSkillName, value: number) => {
    gameDispatch({ type: "setSkillPoints", name: key, value });
  };

  return (
    <fieldset className={"unit-skills-wrapper"} data-editable={true}>
      <legend className={"outlined"}>Skills</legend>

      <div className={"header"}>
        <LabelWithValue title={"skill points"} value={hero.characteristics.availableSkillPoints} />
      </div>

      <div className={"body"}>
        {Object.values(hero.characteristics.skills).map((stat) => {
          const { value, min, name } = stat;

          return (
            <StatRow key={name} stat={stat}>
              <>
                <Button size={"small"} disabled={value === min} onClick={() => handlePointsChangeClick(name, -1)}>
                  <label>-</label>
                </Button>

                <Button
                  size={"small"}
                  disabled={hero.characteristics.availableSkillPoints === 0}
                  onClick={() => handlePointsChangeClick(name, 1)}
                >
                  <label>+</label>
                </Button>
              </>
            </StatRow>
          );
        })}
      </div>
    </fieldset>
  );
}
