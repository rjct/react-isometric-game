import { constants } from "@src/engine/constants";

export interface DictEntity {
  interfaceType: "unit" | "building" | "vehicle";
  size: {
    grid: Size3D;
    screen: Size2D;
  };
  rotationAngles: AngleInDegrees[];
  lootable: boolean;
  clipPath: DictEntityClipPath;
}

export type DictEntityClipPath = {
  [variant: string]: {
    [rotationAngle: string]: {
      spriteUrl: string;
      cssClipPath: string;
    };
  };
};

export function generateInitialClipPathObj(
  rotationAngles: AngleInDegrees[],
  variants: Array<string> | number,
  getSpriteUrl: (variant: string) => string,
) {
  const result: DictEntityClipPath = {};

  const variantsArr = typeof variants === "number" ? Array.from({ length: variants }, (_v, k) => String(k)) : variants;

  variantsArr.forEach((variant) => {
    result[variant] = {};

    for (const rotationAngle of rotationAngles) {
      result[variant][`${rotationAngle}deg`] = {
        spriteUrl: `${constants.ASSETS_URL}/${getSpriteUrl(variant)}`,
        cssClipPath: "",
      };
    }
  });

  return result;
}
