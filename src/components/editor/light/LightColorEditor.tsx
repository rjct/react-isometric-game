import React from "react";
import { Light } from "../../../engine/LightFactory";
import { useDebounce } from "use-debounce";

export function LightColorEditor(props: { entity: Light; onChange: (color: Light["color"]) => void }) {
  const [selectedColor, setSelectedColor] = React.useState<string>(props.entity.getColor());
  const [value] = useDebounce(selectedColor, 100);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  React.useEffect(() => {
    props.onChange(selectedColor);
  }, [value]);

  return (
    <div className={"entity-variant-slider-wrapper"}>
      <div className={"entity-variant-slider-container"}>
        <input disabled={!props.entity} type={"color"} onChange={handleColorChange} value={selectedColor || ""} />
      </div>
      <div className={"entity-variant-slider-value"}>{selectedColor}</div>
    </div>
  );
}
