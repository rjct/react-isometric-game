import { StaticMapLight } from "../context/GameStateContext";
import { LightRay } from "./LightRayFactory";
import { constants } from "../constants";
import { Building } from "./BuildingFactory";
import { randomUUID } from "./helpers";

export class Light {
  public readonly id = randomUUID();
  public readonly className = "light";
  public position: GridCoordinates;
  private color = "#ffffff";
  public radius = 6;
  public rays: LightRay[] = [];

  constructor(props: StaticMapLight) {
    this.position = props.position;

    if (props.color) {
      this.color = props.color;
    }

    if (props.radius) {
      this.radius = props.radius;
    }

    this.createRays();
  }

  setColor(color: string) {
    this.color = color;

    for (const ray of this.rays) {
      ray.setColor(color);
    }
  }

  getColor() {
    return this.color;
  }

  createRays() {
    const rays: Array<LightRay> = [];

    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / (180 * constants.LIGHT_RENDER_PASSES)) {
      const ray = new LightRay({ position: this.position, radius: this.radius, color: this.getColor() });

      ray.setDirection(angle);

      rays.push(ray);
    }

    this.rays = rays;
  }

  castRays(objects: Array<Building>) {
    for (const ray of this.rays) {
      ray.cast(objects);
    }
  }

  setPosition(position: GridCoordinates) {
    this.position = position;

    for (const ray of this.rays) {
      ray.setPosition(position);
    }
  }

  setRadius(radius: number) {
    this.radius = radius;

    for (const ray of this.rays) {
      ray.setLen(radius);
    }
  }

  getHash() {
    return `${this.position.x}:${this.position.y}:${this.radius}:${this.getColor()}`;
  }
}
