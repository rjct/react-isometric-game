import { StaticMapLight } from "../context/GameStateContext";
import { LightRay } from "./LightRayFactory";

export class Light {
  public readonly id = crypto.randomUUID();
  public readonly className = "light";
  public position: Coordinates;
  private color = "#ffffff";
  public radius = 6;
  public readonly ray: LightRay;

  constructor(props: StaticMapLight) {
    this.position = props.position;

    if (props.color) {
      this.color = props.color;
    }

    if (props.radius) {
      this.radius = props.radius;
    }

    this.ray = new LightRay(this);
  }

  setColor(color: string) {
    this.color = color;
    this.ray.color = color;
  }

  getColor() {
    return this.color;
  }
}
