import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnitPreview } from "@src/components/editor/unit/UnitPreview";
import { EntityInventoryEditor } from "@src/components/editor/_shared/EntityInventoryEditor";
import { EntityPositionEditor } from "@src/components/editor/_shared/EntityPositionEditor";
import { EntityRotationSelector } from "@src/components/editor/_shared/EntityRotationSelector";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { Switch } from "@src/components/ui/Switch";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";

export const UnitPropsEditor = (props: { unit: Unit }) => {
  const { gameDispatch, uiDispatch } = useGameState();
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
            <TableRow label={"Rotation"}>
              <EntityRotationSelector
                values={props.unit.getAvailableRotationAngles()}
                selectedValue={props.unit.rotation.deg}
                onChange={(rotation) => {
                  gameDispatch({ type: "setUnitRotation", entityId: props.unit.id, rotation });
                }}
              />
            </TableRow>
            <TableRow label={"Position"}>
              <EntityPositionEditor
                entity={props.unit}
                onChange={(coordinates) => {
                  gameDispatch({
                    type: "setUnitPosition",
                    entityId: props.unit.id,
                    coordinates,
                  });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </div>

      <EntityInventoryEditor entity={props.unit} />

      <div className={"editor-controls"}>
        <Button
          className={["ui-button-green"]}
          onClick={() => {
            uiDispatch({ type: "setScene", scene: "unitCharacteristics" });
          }}
        >
          <FontAwesomeIcon icon={faEdit} />
          <label>Edit chars.</label>
        </Button>

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
