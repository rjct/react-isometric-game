import { UnitLibraryItem } from "@src/components/editor/unit/UnitLibraryItem";
import units from "@src/dict/units.json";
import { DictUnits } from "@src/engine/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";

export function UnitLibrary() {
  const { uiState } = useGameState();

  return uiState.editorMode === "units" ? (
    <div className={"ui-tabs"} data-direction={"vertical"}>
      <div className={"ui-tab-content"}>
        <div className={"editor-library-scroller"}>
          {Object.values(units as DictUnits).map((unit) => (
            <UnitLibraryItem key={unit.type} item={unit} />
          ))}
        </div>
      </div>
    </div>
  ) : null;
}
