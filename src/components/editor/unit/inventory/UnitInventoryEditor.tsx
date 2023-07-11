import React from "react";
import { Unit } from "../../../../engine/UnitFactory";
import { UnitInventoryItemEditor } from "./UnitInventoryItemEditor";
import { UnitInventoryEmptyText } from "./UnitInventoryEmptyText";

export const UnitInventoryEditor = (props: { inventory: Unit["inventory"] }) => {
  const [selectedInventoryMode, setSelectedInventoryMode] = React.useState<keyof Unit["inventory"]>("backpack");

  const handleUnitInventoryModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInventoryMode(e.target.value as keyof Unit["inventory"]);
  };

  return (
    <fieldset key={"unit-inventory-editor"}>
      <legend>Inventory</legend>

      <div className={"ui-tabs"}>
        <div className={"ui-tabs-nav"}>
          {Object.entries(props.inventory).map(([key, value]) => {
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

        {Object.entries(props.inventory).map(([key, value]) => {
          return key === selectedInventoryMode ? (
            <div key={key} className={"ui-tab-content"}>
              <ul className={"unit-inventory-items-list"}>
                {Array.isArray(value) ? (
                  value.length > 0 ? (
                    value.map((entity) => <UnitInventoryItemEditor key={entity.id} entity={entity} />)
                  ) : (
                    <UnitInventoryEmptyText />
                  )
                ) : value ? (
                  <UnitInventoryItemEditor entity={value} />
                ) : (
                  <UnitInventoryEmptyText />
                )}
              </ul>
            </div>
          ) : null;
        })}
      </div>
    </fieldset>
  );
};
