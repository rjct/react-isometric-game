import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BuildingPositionEditor } from "@src/components/editor/building/BuildingPositionEditor";
import { EntityDirectionSelector } from "@src/components/editor/_shared/EntityDirectionSelector";
import { InputRange } from "@src/components/editor/_shared/InputRange";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { Switch } from "@src/components/ui/Switch";
import { Building } from "@src/engine/BuildingFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";

export function BuildingPropsEditor(props: { building: Building }) {
  const { gameDispatch } = useGameState();
  const { checkEditorMode } = useEditor();

  if (!checkEditorMode(["buildings"])) return null;
  if (!props.building) return <NothingSelectedText />;

  return (
    <fieldset>
      <legend>Building</legend>
      <div className={"editor-props-wrapper"}>
        <table>
          <tbody>
            <TableRow label={"ID"}>{props.building.id}</TableRow>
            <TableRow label={"Class"}>{props.building.class}</TableRow>
            <TableRow label={"Type"}>{props.building.type}</TableRow>
            <TableRow label={"Occupies cell"}>
              <Switch
                title={""}
                checked={props.building.occupiesCell}
                onChange={(e) => {
                  gameDispatch({
                    type: "setBuildingOccupiesCell",
                    entityId: props.building.id,
                    value: e.target.checked,
                  });
                }}
              />
            </TableRow>
            <TableRow label={"Position"}>
              <BuildingPositionEditor building={props.building} />
            </TableRow>
            <TableRow label={"Direction"}>
              <EntityDirectionSelector
                values={props.building.getAvailableDirections()}
                selectedValue={props.building.direction}
                onChange={(direction) => {
                  gameDispatch({ type: "setBuildingDirection", entityId: props.building.id, direction });
                }}
              />
            </TableRow>

            <TableRow label={"Variant"}>
              <InputRange
                initialValue={props.building.variant}
                valueSuffix={""}
                min={0}
                max={[...Array(props.building.variants).keys()].length - 1}
                onChange={(variant: number) => {
                  gameDispatch({ type: "setBuildingVariant", entityId: props.building.id, variant });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </div>

      <div className={"editor-controls"}>
        <Button
          className={["ui-button-red"]}
          disabled={!props.building}
          onClick={() => {
            gameDispatch({ type: "deleteSelectedBuilding", entityId: props.building.id });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
          <label>Delete</label>
        </Button>
      </div>
    </fieldset>
  );
}
