import { Button } from "@src/components/ui/Button";
import { LabelWithValue } from "@src/components/ui/LabelWithValue";
import { StatRow } from "@src/components/_modals/unit_characteristics/StatRow";
import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";

export function Skills(props: { unit: Unit }) {
  const { gameDispatch } = useGameState();

  const handlePointsChangeClick = (key: UnitSkillName, value: number) => {
    gameDispatch({ type: "setSkillPoints", unit: props.unit, skillName: key, skillValue: value });
  };

  return (
    <fieldset className={"unit-skills-wrapper"} data-editable={true}>
      <legend className={"outlined"}>Skills</legend>

      <div className={"header"}>
        <LabelWithValue title={"skill points"} value={props.unit.characteristics.availableSkillPoints} />
      </div>

      <div className={"body"}>
        {Object.values(props.unit.characteristics.skills).map((stat) => {
          const { value, min, name } = stat;

          return (
            <StatRow key={name} stat={stat}>
              <>
                <Button size={"small"} disabled={value === min} onClick={() => handlePointsChangeClick(name, -1)}>
                  <label>-</label>
                </Button>

                <Button
                  size={"small"}
                  disabled={props.unit.characteristics.availableSkillPoints === 0}
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
