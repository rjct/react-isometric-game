import { Tab } from "@src/components/ui/Tab";
import { InventoryItemsList } from "@src/components/_modals/inventory/_shared/InventoryItemsList";
import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import React from "react";

export const EntityInventoryEditor = (props: { entity: Building | Unit }) => {
  const [selectedInventoryMode, setSelectedInventoryMode] = React.useState<keyof Unit["inventory"]>("main");

  if (!props.entity.dictEntity.explorable) return null;

  const handleUnitInventoryModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInventoryMode(e.target.value as keyof Unit["inventory"]);
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
                owner={props.entity}
                inventoryType={selectedInventoryMode}
                selectable={false}
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
