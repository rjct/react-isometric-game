import React from "react";
import { useDebounce } from "use-debounce";

export function InputColor(props: { initialValue: string; onChange: (color: string) => void }) {
  const [selectedColor, setSelectedColor] = React.useState("");
  const [value] = useDebounce(selectedColor, 100);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  React.useEffect(() => {
    if (selectedColor === "") return;

    props.onChange(selectedColor);
  }, [value]);

  React.useEffect(() => {
    setSelectedColor(props.initialValue);
  }, [props.initialValue]);

  return (
    <div className={"entity-variant-slider-wrapper"}>
      <div className={"entity-variant-slider-container"}>
        <input
          disabled={!props.initialValue}
          type={"color"}
          onChange={handleColorChange}
          value={selectedColor === "" ? "#000000" : selectedColor}
        />
      </div>
      <div className={"entity-variant-slider-value"}>{selectedColor}</div>
    </div>
  );
}
