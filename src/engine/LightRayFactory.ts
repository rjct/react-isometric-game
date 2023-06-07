import { Light } from "./LightFactory";
import { constants } from "../constants";
import { Unit } from "./UnitFactory";
import { Building } from "./BuildingFactory";

export class LightRay {
  x: number;
  y: number;
  private angle: number;
  len: number;
  nx = 0;
  ny = 0;
  color: string;

  constructor(light: Light) {
    this.x = light.position.x * constants.wireframeTileSize.width;
    this.y = light.position.y * constants.wireframeTileSize.height;
    this.angle = 0;
    this.len = light.radius * constants.wireframeTileSize.width;
    this.color = light.getColor();

    this.setDirection(0);
  }

  setDirection(dir: number) {
    this.nx = Math.cos(dir);
    this.ny = Math.sin(dir);
  }

  pathEnd(ctx: CanvasRenderingContext2D) {
    ctx.lineTo(this.nx * this.len, this.ny * this.len);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(0, 0, this.len / 2, 0, 0, this.len);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "transparent");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.setTransform(1, 0, 0, 1, this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.nx * this.len, this.ny * this.len);
    ctx.stroke();
  }

  cast(objects: Array<Unit | Building>) {
    let minDist = this.len;
    let i = objects.length;

    while (i > 0) {
      i -= 1;
      minDist = Math.min(objects[i].rayDist2Polygon(this), minDist);
    }

    this.len = minDist;
  }
}
