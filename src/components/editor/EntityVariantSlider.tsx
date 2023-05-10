import React from "react";
import { Building, DictBuilding } from "../../engine/BuildingFactory";

export function EntityVariantSlider(props: {
  entity?: Building | (DictBuilding & { variant: number });
  onChange: (variant: Building["variant"]) => void;
}) {
  const [selectedVariant, setSelectedVariant] = React.useState<number>(0);
  const variants: number[] = props.entity ? [...Array(props.entity.variants).keys()] : [];

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const variant = Number(e.target.value);

    setSelectedVariant(variant);
    props.onChange(variant);
  };

  React.useEffect(() => {
    setSelectedVariant(props.entity?.variant || 0);
  }, [props.entity?.variant]);

  return (
    <div className={"entity-variant-slider-wrapper"}>
      <div className={"entity-variant-slider-container"}>
        <input
          disabled={!props.entity || variants.length <= 1}
          type={"range"}
          min={0}
          max={variants.length - 1}
          step={1}
          onChange={handleVariantChange}
          value={selectedVariant || 0}
        />
      </div>
      <div className={"entity-variant-slider-value"}>{selectedVariant}</div>
    </div>
  );
}
