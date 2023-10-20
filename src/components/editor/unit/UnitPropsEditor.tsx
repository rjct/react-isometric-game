import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnitPositionEditor } from "@src/components/editor/unit/UnitPositionEditor";
import { UnitPreview } from "@src/components/editor/unit/UnitPreview";
import { EntityDirectionSelector } from "@src/components/editor/_shared/EntityDirectionSelector";
import { EntityInventoryEditor } from "@src/components/editor/_shared/EntityInventoryEditor";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { Switch } from "@src/components/ui/Switch";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";

export const UnitPropsEditor = (props: { unit: Unit }) => {
  const { gameDispatch } = useGameState();
  const { checkEditorMode } = useEditor();

  if (!checkEditorMode(["units"])) return null;
  if (!props.unit) return <NothingSelectedText />;

  return (
    <fieldset>
      <legend>Unit</legend>
      <div className={"editor-props-wrapper"}>
        <UnitPreview unit={props.unit} />

        <table>
          <tbody>
            <TableRow label={"ID"}>{props.unit.id}</TableRow>
            <TableRow label={"Type"}>{props.unit.type}</TableRow>
            <TableRow label={"Dead"}>
              <Switch
                title={""}
                checked={props.unit.isDead}
                disabled={props.unit.isHero}
                onChange={(e) => {
                  gameDispatch({
                    type: "setUnitDead",
                    entityId: props.unit.id,
                    isDead: e.target.checked,
                  });
                }}
              />
            </TableRow>
            <TableRow label={"Direction"}>
              <EntityDirectionSelector
                values={props.unit.getAvailableDirections()}
                selectedValue={props.unit.direction}
                onChange={(direction) => {
                  gameDispatch({ type: "setUnitDirection", entityId: props.unit.id, direction });
                }}
              />
            </TableRow>
            <TableRow label={"Position"}>
              <UnitPositionEditor unit={props.unit} />
            </TableRow>
          </tbody>
        </table>
      </div>

      <EntityInventoryEditor entity={props.unit} />

      <div className={"editor-controls"}>
        <Button
          className={["ui-button-red"]}
          disabled={props.unit.isHero}
          onClick={() => {
            gameDispatch({ type: "deleteSelectedUnit", entityId: props.unit.id });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
          <label>Delete</label>
        </Button>
      </div>
    </fieldset>
  );
};
