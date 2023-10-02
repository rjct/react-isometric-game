import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LightPositionEditor } from "@src/components/editor/light/LightPositionEditor";
import { InputColor } from "@src/components/editor/_shared/InputColor";
import { InputRange } from "@src/components/editor/_shared/InputRange";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { Light } from "@src/engine/light/LightFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";

export function LightPropsEditor(props: { light: Light }) {
  const { gameState, gameDispatch } = useGameState();
  const { checkEditorMode } = useEditor();

  if (!checkEditorMode(["lights"])) return null;
  if (!props.light) return <NothingSelectedText />;

  return (
    <fieldset>
      <legend>
        <div>Light</div>
      </legend>
      <div className={"editor-props-wrapper"}>
        <table>
          <tbody>
            <TableRow label={"ID"}>{props.light.id}</TableRow>
            <TableRow label={"Position"}>
              <LightPositionEditor light={props.light} />
            </TableRow>
            <TableRow label={"Radius"}>
              <InputRange
                initialValue={props.light.radius}
                valueSuffix={""}
                min={0}
                max={Math.max(gameState.mapSize.width, gameState.mapSize.height)}
                onChange={(radius) => {
                  gameDispatch({ type: "setLightRadius", entityId: props.light.id, radius });
                  gameDispatch({ type: "recalculateLightsAndShadows" });
                }}
              />
            </TableRow>
            <TableRow label={"Color"}>
              <InputColor
                initialValue={props.light.getColor()}
                onChange={(color) => {
                  gameDispatch({ type: "setLightColor", entityId: props.light.id, color });
                  gameDispatch({ type: "recalculateLightsAndShadows" });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </div>

      <div className={"editor-controls"}>
        <Button
          className={["ui-button-red"]}
          disabled={!props.light}
          onClick={() => {
            gameDispatch({ type: "deleteSelectedLight", entityId: props.light.id });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
          <label>Delete</label>
        </Button>
      </div>
    </fieldset>
  );
}
