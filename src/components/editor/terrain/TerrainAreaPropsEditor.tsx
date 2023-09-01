import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TerrainAreaExitUrlEditor } from "@src/components/editor/terrain/TerrainAreaExitUrlEditor";
import { TerrainAreaPositionEditor } from "@src/components/editor/terrain/TerrainAreaPositionEditor";
import { TerrainAreaSourcePositionEditor } from "@src/components/editor/terrain/TerrainAreaSourcePositionEditor";
import { TerrainAreaTypeSelector } from "@src/components/editor/terrain/TerrainAreaTypeSelector";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";

export function TerrainAreaPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "terrain" ? (
    gameState.selectedTerrainArea ? (
      <fieldset>
        <legend>Terrain area</legend>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedTerrainArea?.id}</TableRow>
              <TableRow label={"Type"}>
                <TerrainAreaTypeSelector />
              </TableRow>
              <TableRow label={"Position"}>
                <TerrainAreaPositionEditor />
              </TableRow>
              <TableRow label={"Source"}>
                <TerrainAreaSourcePositionEditor />
              </TableRow>
              <TableRow label={"Exit to map"}>
                <TerrainAreaExitUrlEditor />
              </TableRow>
            </tbody>
          </table>
        </div>

        <div className={"editor-controls"}>
          <Button
            className={["ui-button-red"]}
            disabled={!gameState.selectedTerrainArea}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedTerrainArea", entityId: gameState.selectedTerrainArea?.id });
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
}
