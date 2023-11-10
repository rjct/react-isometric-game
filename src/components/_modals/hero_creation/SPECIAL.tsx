import { Button } from "@src/components/ui/Button";
import { LabelWithValue } from "@src/components/ui/LabelWithValue";
import { StatRow } from "@src/components/_modals/hero_creation/StatRow";
import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";

export const SPECIAL = () => {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  const handlePointsChangeClick = (key: UnitPrimaryStatName, value: number) => {
    gameDispatch({ type: "setSPECIALPoints", name: key, value });
  };

  return (
    <fieldset className={"unit-SPECIAL-wrapper"} data-editable={true}>
      <legend className={"outlined"}>S.P.E.C.I.A.L.</legend>

      <div className={"header"}>
        <LabelWithValue title={"char points"} value={hero.characteristics.availablePoints} />
      </div>

      <div className={"body"}>
        {Object.values(hero.characteristics.SPECIAL).map((stat) => {
          const { value, name } = stat;

          return (
            <StatRow key={name} stat={stat}>
              <>
                <Button size={"small"} disabled={value === 0} onClick={() => handlePointsChangeClick(name, -1)}>
                  <label>-</label>
                </Button>
                <Button
                  size={"small"}
                  disabled={hero.characteristics.availablePoints === 0 || value === 10}
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
};
