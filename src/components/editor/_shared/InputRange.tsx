import React from "react";
import { useDebounce } from "use-debounce";

export function InputRange(props: {
  initialValue: number;
  valueSuffix: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [selectedValue, setSelectedValue] = React.useState<number>(-1);
  const [value] = useDebounce(selectedValue, 100);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(Number(e.target.value));
  };

  React.useEffect(() => {
    if (value < 0) return;

    props.onChange(value);
  }, [value]);

  React.useEffect(() => {
    setSelectedValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <div className={"entity-variant-slider-wrapper"}>
      <div className={"entity-variant-slider-container"}>
        <input
          type={"range"}
          min={props.min}
          max={props.max}
          step={1}
          onChange={handleValueChange}
          value={selectedValue || 0}
        />
      </div>
      <div className={"entity-variant-slider-value"}>
        {selectedValue}
        {props.valueSuffix}
      </div>
    </div>
  );
}
