import React from "react";
import { Light } from "../../../engine/LightFactory";

export function LightRadiusEditor(props: { entity?: Light; onChange: (radius: Light["radius"]) => void }) {
  const [selectedRadius, setSelectedRadius] = React.useState<number>(0);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius = Number(e.target.value);

    setSelectedRadius(radius);
    props.onChange(radius);
  };

  React.useEffect(() => {
    setSelectedRadius(props.entity?.radius || 0);
  }, [props.entity?.radius]);

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
