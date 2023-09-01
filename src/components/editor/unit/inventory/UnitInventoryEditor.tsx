import { InventoryItemsList } from "@src/components/inventory/InventoryItemsList";
import { Tab } from "@src/components/ui/Tab";
import { Unit } from "@src/engine/UnitFactory";
import React from "react";

export const UnitInventoryEditor = (props: { unit: Unit }) => {
  const [selectedInventoryMode, setSelectedInventoryMode] = React.useState<keyof Unit["inventory"]>("backpack");

  const handleUnitInventoryModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInventoryMode(e.target.value as keyof Unit["inventory"]);
  };

  return (
    <fieldset key={"unit-inventory-editor"}>
      <legend>Inventory</legend>

      <div className={"ui-tabs"}>
        <div className={"ui-tabs-nav"}>
          {Object.entries(props.unit.inventory).map(([key, value]) => {
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

        {Object.entries(props.unit.inventory).map(([key]) => {
          return key === selectedInventoryMode ? (
            <div key={key} className={"ui-tab-content"}>
              <InventoryItemsList
                unit={props.unit}
                inventoryType={selectedInventoryMode}
                editable={true}
                draggable={false}
              />
            </div>
          ) : null;
        })}
      </div>
    </fieldset>
  );
};
