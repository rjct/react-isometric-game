import React from "react";

export function EntityDirectionSelector(props: {
  values: Array<Direction>;
  selectedValue: Direction;
  onChange: (value: Direction) => void;
}) {
  const [selectedValue, setSelectedValue] = React.useState<Direction>(props.selectedValue);

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Direction;

    setSelectedValue(value);
    props.onChange(value);
  };

  React.useEffect(() => {
    setSelectedValue(props.selectedValue);
  }, [props.selectedValue]);

  return (
    <select value={selectedValue} onChange={handleValueChange}>
      {props.values.map((direction) => {
        return (
          <option key={direction} value={direction}>
            {direction}
          </option>
        );
      })}
    </select>
  );
}
