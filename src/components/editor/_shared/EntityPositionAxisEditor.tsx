import React from "react";

export function EntityPositionAxisEditor(props: {
  label: string;
  min: number;
  max: number;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const [value, setValue] = React.useState(props.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
    props.onChange(Number(e.target.value));
  };

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className={"coordinates-row"}>
      <div className={"label"}>{props.label}:</div>
      <div className={"value"}>
        <input
          type="number"
          min={props.min}
          max={props.max}
          value={value}
          disabled={props.disabled}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
