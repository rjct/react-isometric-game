import { Button } from "@src/components/ui/Button";
import { Tab } from "@src/components/ui/Tab";
import { InventoryItemsList } from "@src/components/_modals/inventory/_shared/InventoryItemsList";
import { Building } from "@src/engine/building/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const EntityInventoryEditor = (props: { entity: Building | Unit | Vehicle }) => {
  const { uiDispatch } = useGameState();
  const [selectedInventoryMode, setSelectedInventoryMode] = React.useState<keyof Unit["inventory"]>("main");

  if (!props.entity.dictEntity.lootable) return null;

  const handleUnitInventoryModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInventoryMode(e.target.value as keyof Unit["inventory"]);
  };

  const handleAddItemButtonClick = () => {
    uiDispatch({ type: "setEditorMode", editorMode: "manageInventory" });
  };

  return (
    <fieldset>
      <legend>Inventory</legend>

      <div className={"ui-tabs"}>
        <div className={"ui-tabs-nav"}>
          {Object.entries(props.entity.inventory).map(([key, value]) => {
            const isActive = key === selectedInventoryMode;

            return (
              <Tab
                key={key}
                id={`editor--unit-inventory-${key}`}
                value={key}
                title={""}
                active={isActive}
                disabled={isActive}
                onSelect={handleUnitInventoryModeChange}
              >
                {key} ({Array.isArray(value) ? value.length : value ? 1 : 0})
              </Tab>
            );
          })}
        </div>

        {Object.entries(props.entity.inventory).map(([key]) => {
          return key === selectedInventoryMode ? (
            <div key={key} className={"ui-tab-content"}>
              <InventoryItemsList
                inventoryItems={props.entity.getInventoryItemsGrouped(selectedInventoryMode)}
                selectable={false}
                editable={true}
                draggable={false}
                compact={true}
              />

              <Button className={["ui-button-green"]} onClick={handleAddItemButtonClick}>
                <label>Manage items</label>
              </Button>
            </div>
          ) : null;
        })}
      </div>
    </fieldset>
  );
};
