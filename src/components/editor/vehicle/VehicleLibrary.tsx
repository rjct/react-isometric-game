import { VehicleLibraryItem } from "@src/components/editor/vehicle/VehicleLibraryItem";
import getVehiclesDictList from "@src/dict/vehicle/_vehicle";
import { useGameState } from "@src/hooks/useGameState";

export function VehicleLibrary() {
  const { uiState } = useGameState();

  return uiState.editorMode === "vehicles" ? (
    <div className={"ui-tabs"} data-direction={"vertical"}>
      <div className={"ui-tab-content"}>
        <div className={"editor-library-scroller"}>
          {Object.values(getVehiclesDictList()).map((vehicle) => (
            <VehicleLibraryItem key={vehicle.type} item={vehicle} />
          ))}
        </div>
      </div>
    </div>
  ) : null;
}
