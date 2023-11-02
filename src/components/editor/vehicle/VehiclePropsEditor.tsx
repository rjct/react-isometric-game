import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityInventoryEditor } from "@src/components/editor/_shared/EntityInventoryEditor";
import { EntityPositionEditor } from "@src/components/editor/_shared/EntityPositionEditor";
import { EntityRotationSelector } from "@src/components/editor/_shared/EntityRotationSelector";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";

export const VehiclePropsEditor = (props: { vehicle: Vehicle }) => {
  const { gameDispatch } = useGameState();
  const { checkEditorMode } = useEditor();

  if (!checkEditorMode(["vehicles"])) return null;
  if (!props.vehicle) return <NothingSelectedText />;

  return (
    <fieldset>
      <legend>Vehicle</legend>
      <div className={"editor-props-wrapper"}>
        <table>
          <tbody>
            <TableRow label={"ID"}>{props.vehicle.id}</TableRow>
            <TableRow label={"Type"}>{props.vehicle.type}</TableRow>

            <TableRow label={"Rotation"}>
              <EntityRotationSelector
                values={props.vehicle.getAvailableRotationAngles()}
                selectedValue={props.vehicle.rotation.deg}
                onChange={(rotation) => {
                  gameDispatch({ type: "setVehicleRotation", entityId: props.vehicle.id, rotation });
                }}
              />
            </TableRow>
            <TableRow label={"Position"}>
              <EntityPositionEditor
                entity={props.vehicle}
                onChange={(coordinates) => {
                  gameDispatch({
                    type: "setVehiclePosition",
                    entityId: props.vehicle.id,
                    coordinates,
                  });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </div>

      <EntityInventoryEditor entity={props.vehicle} />

      <div className={"editor-controls"}>
        <Button
          className={["ui-button-red"]}
          onClick={() => {
            gameDispatch({ type: "deleteSelectedVehicle", entityId: props.vehicle.id });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
          <label>Delete</label>
        </Button>
      </div>
    </fieldset>
  );
};
