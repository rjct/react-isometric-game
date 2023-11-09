import { GameMap } from "@src/engine/gameMap";
import { randomUUID } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import React from "react";

export type VfxType = "explosion" | "fire-explosion" | "muzzle-1" | "muzzle-2" | "muzzle-3" | "hit-ground";
export type VfxLight = {
  animationDuration: number;
  radius: number;
  color: string;
};

export class Vfx {
  id = randomUUID();

  readonly position: GridCoordinates;
  readonly type: VfxType;
  readonly angle: AngleInDegrees;
  readonly animationDuration: number = 0;
  readonly animationDelay: string = "0ms";
  lightEffect: {
    elapsedTime: number;
    animationDuration: number;
    animationRadiusMultiplier: number;
    light: Light;
    radius: number;
  } | null = null;
  elapsedTime = 0;
  constructor(props: {
    coordinates: GridCoordinates;
    type: VfxType;
    angle?: AngleInDegrees;
    animationDuration: number;
    animationDelay?: string;
    light?: VfxLight;
  }) {
    this.position = props.coordinates;

    this.type = props.type;
    this.angle = Math.round(props.angle || 0);
    this.animationDuration = props.animationDuration;

    if (this.animationDelay) {
      this.animationDelay = props.animationDelay || "0ms";
    }

    if (props.light) {
      this.lightEffect = {
        animationDuration: props.light.animationDuration,
        animationRadiusMultiplier: (props.light.radius / props.light.animationDuration) * 1000,
        elapsedTime: 0,
        radius: props.light.radius,
        light: new Light({
          position: this.position,
          color: props.light.color,
          radius: 0.01,
        }),
      };
    }
  }

  update(gameState: GameMap, deltaTime: number) {
    const deltaTimeInSeconds = deltaTime * 1000;

    this.elapsedTime += deltaTimeInSeconds;

    if (this.lightEffect) {
      this.lightEffect.elapsedTime += deltaTimeInSeconds;
    }
  }

  isAnimationCompleted() {
    return this.elapsedTime >= this.animationDuration;
  }

  isLightAnimationCompleted() {
    if (!this.lightEffect) return true;

    return this.lightEffect.elapsedTime >= this.lightEffect.animationDuration;
  }

  getElementCss(): React.CSSProperties {
    return {
      zIndex: Math.ceil(this.position.x + 1) + Math.ceil(this.position.y + 1) + 1,
      animationDuration: `${this.animationDuration}ms`,
      animationDelay: this.animationDelay,
      transform: `rotateX(60deg) rotateZ(${this.angle - 45}deg)`,
    };
  }
}
