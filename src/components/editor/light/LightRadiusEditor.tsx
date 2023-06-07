import React from "react";
import { Light } from "../../../engine/LightFactory";
import { useDebounce } from "use-debounce";

export function LightRadiusEditor(props: { entity: Light; onChange: (radius: Light["radius"]) => void }) {
  const [selectedRadius, setSelectedRadius] = React.useState<number>(props.entity.radius);
  const [value] = useDebounce(selectedRadius, 100);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadius(Number(e.target.value));
  };

  React.useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <div className={"entity-variant-slider-wrapper"}>
      <div className={"entity-variant-slider-container"}>
        <input
          disabled={!props.entity}
          type={"range"}
          min={0}
          max={20}
          step={1}
          onChange={handleRadiusChange}
          value={selectedRadius || 0}
        />
      </div>
      <div className={"entity-variant-slider-value"}>{selectedRadius}</div>
    </div>
  );
}
