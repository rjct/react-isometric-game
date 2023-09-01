import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BuildingDirectionSelector } from "@src/components/editor/building/BuildingDirectionSelector";
import { BuildingOccupiesCellSwitch } from "@src/components/editor/building/BuildingOccupiesCellSwitch";
import { BuildingPositionEditor } from "@src/components/editor/building/BuildingPositionEditor";
import { InputRange } from "@src/components/editor/_shared/InputRange";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";

export function BuildingPropsEditor() {
  const { gameState, uiState, gameDispatch } = useGameState();

  return uiState.editorMode === "buildings" ? (
    gameState.selectedBuilding ? (
      <fieldset>
        <legend>Building</legend>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedBuilding?.id}</TableRow>
              <TableRow label={"Class"}>{gameState.selectedBuilding?.class}</TableRow>
              <TableRow label={"Type"}>{gameState.selectedBuilding?.type}</TableRow>
              <TableRow label={"Occupies cell"}>
                <BuildingOccupiesCellSwitch />
              </TableRow>
              <TableRow label={"Position"}>
                <BuildingPositionEditor />
              </TableRow>
              <TableRow label={"Direction"}>
                <BuildingDirectionSelector />
              </TableRow>

              <TableRow label={"Variant"}>
                <InputRange
                  initialValue={gameState.selectedBuilding.variant}
                  valueSuffix={""}
                  min={0}
                  max={[...Array(gameState.selectedBuilding.variants).keys()].length - 1}
                  onChange={(variant: number) => {
                    gameDispatch({ type: "setBuildingVariant", entityId: gameState.selectedBuilding.id, variant });
                  }}
                />
              </TableRow>
            </tbody>
          </table>
        </div>

        <div className={"editor-controls"}>
          <Button
            className={["ui-button-red"]}
            disabled={!gameState.selectedBuilding}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedBuilding", entityId: gameState.selectedBuilding?.id });
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
