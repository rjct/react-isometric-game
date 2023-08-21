import React from "react";
import { Unit } from "../../../../engine/UnitFactory";
import { InventoryItemsList } from "../../../inventory/InventoryItemsList";

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
            const activeClass = isActive ? "active" : "";

            return (
              <div className={["ui-button", activeClass].join(" ")} key={key}>
                <label className="ui-radio" htmlFor={`editor--unit-inventory-${key}`} title={key}>
                  <input
                    type={"radio"}
                    name={"editor--unit-inventory"}
                    id={`editor--unit-inventory-${key}`}
                    value={key}
                    checked={isActive}
                    disabled={isActive}
                    onChange={handleUnitInventoryModeChange}
                  />
                  <div className={"label"}>
                    <span>
                      {key} ({Array.isArray(value) ? value.length : value ? 1 : 0})
                    </span>
                  </div>
                </label>
              </div>
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
