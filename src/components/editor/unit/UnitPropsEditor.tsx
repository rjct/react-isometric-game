import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnitInventoryEditor } from "@src/components/editor/unit/inventory/UnitInventoryEditor";
import { UnitDeadSwitch } from "@src/components/editor/unit/UnitDeadSwitch";
import { UnitDirectionSelector } from "@src/components/editor/unit/UnitDirectionSelector";
import { UnitPositionEditor } from "@src/components/editor/unit/UnitPositionEditor";
import { UnitPreview } from "@src/components/editor/unit/UnitPreview";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";

export const UnitPropsEditor = (props: { unit: Unit }) => {
  const { uiState, gameDispatch } = useGameState();

  return uiState.editorMode === "units" ? (
    props.unit ? (
      <fieldset>
        <legend>Unit</legend>
        <div className={"editor-props-wrapper"}>
          <UnitPreview />

          <table>
            <tbody>
              <TableRow label={"ID"}>{props.unit.id}</TableRow>
              <TableRow label={"Type"}>{props.unit.type}</TableRow>
              <TableRow label={"Dead"}>
                <UnitDeadSwitch />
              </TableRow>
              <TableRow label={"Direction"}>
                <UnitDirectionSelector />
              </TableRow>
              <TableRow label={"Position"}>
                <UnitPositionEditor />
              </TableRow>
            </tbody>
          </table>
        </div>

        <UnitInventoryEditor unit={props.unit} />

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
    ) : (
      <NothingSelectedText />
    )
  ) : null;
};
