import { InputRange } from "@src/components/editor/_shared/InputRange";
import { TableRow } from "@src/components/editor/_shared/TableRow";
import { useGameState } from "@src/hooks/useGameState";

export function GlobalLightsPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "lights" ? (
    <div className={"editor-props-wrapper"}>
      <fieldset>
        <legend>Global lights</legend>
        <table>
          <tbody>
            <TableRow label={"Opacity"}>
              <InputRange
                min={0}
                max={100}
                step={1}
                initialValue={Math.trunc(100 - gameState.globalLights.opacity * 100)}
                valueSuffix={"%"}
                onChange={(opacity) => {
                  gameDispatch({ type: "setGlobalLightsOpacity", opacity: (100 - opacity) / 100 });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </fieldset>
    </div>
  ) : null;
}
