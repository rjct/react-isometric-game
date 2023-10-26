import React from "react";

export function EntityRotationSelector(props: {
  values: Array<AngleInDegrees>;
  selectedValue: AngleInDegrees;
  onChange: (value: AngleInDegrees) => void;
}) {
  const [selectedValue, setSelectedValue] = React.useState<AngleInDegrees>(props.selectedValue);

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value) as AngleInDegrees;

    setSelectedValue(value);
    props.onChange(value);
  };

  React.useEffect(() => {
    setSelectedValue(props.selectedValue);
  }, [props.selectedValue]);

  return (
    <select value={selectedValue} onChange={handleValueChange}>
      {props.values.map((rotation) => {
        return (
          <option key={rotation} value={rotation}>
            {rotation}°
          </option>
        );
      })}
    </select>
  );
}
