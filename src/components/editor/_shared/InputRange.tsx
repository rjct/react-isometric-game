import { randomUUID } from "@src/engine/helpers";
import React from "react";
import { useDebounce } from "use-debounce";

export function InputRange(props: {
  initialValue: number;
  valueSuffix: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const [selectedValue, setSelectedValue] = React.useState<number>(-1);
  const [value] = useDebounce(selectedValue, 100);
  const id = randomUUID();

  const values = React.useMemo(() => {
    const values = [];

    for (let i = props.min; i <= props.max; i += props.step) {
      values.push(i);
    }

    return values;
  }, []);

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
          step={props.step}
          onChange={handleValueChange}
          value={selectedValue || 0}
          list={id}
        />

        <datalist id={id}>
          {values.map((value) => (
            <option key={value} value={value} label={`${value}`}></option>
          ))}
        </datalist>
      </div>
      <div className={"entity-variant-slider-value"}>
        {selectedValue}
        {props.valueSuffix}
      </div>
    </div>
  );
}
