import { randomUUID } from "@src/engine/helpers";
import React from "react";

export type VfxType = "explosion" | "fire-explosion" | "muzzle-1" | "muzzle-2" | "muzzle-3";

export class Vfx {
  id = randomUUID();

  readonly position: GridCoordinates;
  readonly type: VfxType;
  readonly angle: AngleInDegrees;
  readonly animationDelay: string = "0ms";
  constructor(props: {
    coordinates: GridCoordinates;
    type: VfxType;
    angle?: AngleInDegrees;
    animationDelay?: string;
    elevationLevel?: number;
  }) {
    this.position = props.coordinates;

    this.type = props.type;
    this.angle = Math.round(props.angle || 0);

    if (this.animationDelay) {
      this.animationDelay = props.animationDelay || "0ms";
    }
  }

  getElementCss(): React.CSSProperties {
    return {
      zIndex: Math.ceil(this.position.x + 1) + Math.ceil(this.position.y + 1) + 1,
      animationDelay: this.animationDelay,
      transform: `rotateX(60deg) rotateZ(${this.angle + 45}deg)`,
    };
  }
}
