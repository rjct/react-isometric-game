import units from "../../../dict/units.json";
import { useGameState } from "../../../hooks/useGameState";
import { UnitLibraryItem } from "./UnitLibraryItem";
import { DictUnits } from "../../../engine/UnitFactory";

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
