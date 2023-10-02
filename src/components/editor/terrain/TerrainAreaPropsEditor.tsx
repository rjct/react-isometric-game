import { faClone } from "@fortawesome/free-solid-svg-icons/faClone";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TerrainAreaExitUrlEditor } from "@src/components/editor/terrain/TerrainAreaExitUrlEditor";
import { TerrainAreaPositionEditor } from "@src/components/editor/terrain/TerrainAreaPositionEditor";
import { TerrainAreaSourcePositionEditor } from "@src/components/editor/terrain/TerrainAreaSourcePositionEditor";
import { TerrainAreaTypeSelector } from "@src/components/editor/terrain/TerrainAreaTypeSelector";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";

export function TerrainAreaPropsEditor(props: { terrainArea: TerrainArea }) {
  const { gameState, terrainDispatch } = useGameState();
  const { checkEditorMode } = useEditor();

  if (!checkEditorMode(["terrain"])) return null;
  if (!props.terrainArea) return <NothingSelectedText />;

  return (
    <fieldset>
      <legend>Terrain area</legend>
      <div className={"editor-props-wrapper"}>
        <table>
          <tbody>
            <TableRow label={"ID"}>{props.terrainArea.id}</TableRow>
            <TableRow label={"Type"}>
              <TerrainAreaTypeSelector terrainArea={props.terrainArea} />
            </TableRow>
            <TableRow label={"Position"}>
              <TerrainAreaPositionEditor terrainArea={props.terrainArea} />
            </TableRow>
            <TableRow label={"Source"}>
              <TerrainAreaSourcePositionEditor terrainArea={props.terrainArea} />
            </TableRow>
            <TableRow label={"Exit to map"}>
              <TerrainAreaExitUrlEditor terrainArea={props.terrainArea} />
            </TableRow>
          </tbody>
        </table>
      </div>

      <div className={"editor-controls"}>
        <Button
          className={["ui-button-green"]}
          disabled={!props.terrainArea}
          onClick={() => {
            terrainDispatch({
              type: "cloneSelectedTerrainArea",
              entityId: props.terrainArea.id,
              mapSize: gameState.mapSize,
            });
          }}
        >
          <FontAwesomeIcon icon={faClone} />
          <label>Clone</label>
        </Button>

        <Button
          className={["ui-button-red"]}
          disabled={!props.terrainArea}
          onClick={() => {
            terrainDispatch({ type: "deleteSelectedTerrainArea", entityId: props.terrainArea.id });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
          <label>Delete</label>
        </Button>
      </div>
    </fieldset>
  );
}
