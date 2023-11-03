import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons/faArrowDownWideShort";
import { faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons/faArrowUpShortWide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { InventoryItemSortingProp, inventoryItemSortingProps } from "@src/engine/InventoryItemFactory";
import React from "react";

export type InventoryItemsSortingState = {
  prop: InventoryItemSortingProp;
  direction: "asc" | "desc";
};

export function InventoryItemsSortControl(props: {
  sortingState: InventoryItemsSortingState;
  onChange: (sortingState: InventoryItemsSortingState) => void;
}) {
  const [sortingState, setSortingState] = React.useState(props.sortingState);

  const handleSortingPropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = (e.target.value || undefined) as InventoryItemSortingProp;

    setSortingState({ ...sortingState, ...{ prop: value } });
  };

  const handleSortingDirectionChange = (direction: InventoryItemsSortingState["direction"]) => {
    setSortingState({ ...sortingState, ...{ direction } });
  };

  React.useEffect(() => {
    props.onChange(sortingState);
  }, [sortingState]);

  return (
    <>
      <select value={sortingState.prop} onChange={handleSortingPropChange}>
        {Object.entries(inventoryItemSortingProps).map(([key, value]) => {
          return (
            <option key={`${key}`} value={key}>
              {value}
            </option>
          );
        })}
      </select>

      <Button
        className={["ui-button-green"]}
        onClick={() => handleSortingDirectionChange(sortingState.direction === "asc" ? "desc" : "asc")}
      >
        <label>
          <FontAwesomeIcon icon={sortingState.direction === "asc" ? faArrowDownWideShort : faArrowUpShortWide} />
        </label>
      </Button>
    </>
  );
}
