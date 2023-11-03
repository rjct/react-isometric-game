import { InventoryItemClass, inventoryItemClasses } from "@src/engine/InventoryItemFactory";
import React from "react";

export function InventoryItemsFilterControl(props: {
  value: InventoryItemClass | undefined;
  itemsCount?: { [p in InventoryItemClass]: number };
  onChange: (value: InventoryItemClass | undefined) => void;
}) {
  const [value, setValue] = React.useState(props.value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = (e.target.value || undefined) as InventoryItemClass;

    setValue(value);
  };

  React.useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <select value={value} onChange={handleChange}>
      <option value={""}>-- ALL --</option>

      {Object.entries(inventoryItemClasses).map(([key, value]) => {
        return (
          <option key={`${key}`} value={key}>
            {value} {props.itemsCount ? `(${props.itemsCount[key as InventoryItemClass]})` : null}
          </option>
        );
      })}
    </select>
  );
}
