import { Button } from "@src/components/ui/Button";
import { LabelWithValue } from "@src/components/ui/LabelWithValue";
import { StatRow } from "@src/components/_modals/unit_characteristics/StatRow";
import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";

export const SPECIAL = (props: { unit: Unit }) => {
  const { gameDispatch } = useGameState();

  const handlePointsChangeClick = (key: UnitPrimaryStatName, value: number) => {
    gameDispatch({ type: "setSPECIALPoints", unit: props.unit, name: key, value });
  };

  return (
    <fieldset className={"unit-SPECIAL-wrapper"} data-editable={true}>
      <legend className={"outlined"}>S.P.E.C.I.A.L.</legend>

      <div className={"header"}>
        <LabelWithValue title={"char points"} value={props.unit.characteristics.availablePoints} />
      </div>

      <div className={"body"}>
        {Object.values(props.unit.characteristics.SPECIAL).map((stat) => {
          const { value, name } = stat;

          return (
            <StatRow key={name} stat={stat}>
              <>
                <Button size={"small"} disabled={value === 0} onClick={() => handlePointsChangeClick(name, -1)}>
                  <label>-</label>
                </Button>
                <Button
                  size={"small"}
                  disabled={props.unit.characteristics.availablePoints === 0 || value === 10}
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
