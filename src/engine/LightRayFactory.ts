import { Light } from "./LightFactory";
import { constants } from "../constants";
import { Unit } from "./UnitFactory";
import { Building } from "./BuildingFactory";

export class LightRay {
  ctx: CanvasRenderingContext2D;
  light: Light;
  x: number;
  y: number;
  private angle: number;
  len: number;
  nx = 0;
  ny = 0;
  gradient: CanvasGradient;
  constructor(ctx: CanvasRenderingContext2D, light: Light) {
    this.ctx = ctx;
    this.light = light;
    this.x = light.position.x * constants.wireframeTileSize.width;
    this.y = light.position.y * constants.wireframeTileSize.height;
    this.angle = 0;
    this.len = light.radius * constants.wireframeTileSize.width;

    this.gradient = ctx.createRadialGradient(0, 0, this.len / 2, 0, 0, this.len);
    this.gradient.addColorStop(0, light.color);
    this.gradient.addColorStop(1, "transparent");

    this.setDirection(0);
  }

  setDirection(dir: number) {
    this.nx = Math.cos(dir);
    this.ny = Math.sin(dir);
  }

  pathEnd() {
    this.ctx.lineTo(this.nx * this.len, this.ny * this.len);
  }

  draw() {
    this.ctx.strokeStyle = this.gradient;
    this.ctx.lineWidth = 1;
    this.ctx.setTransform(1, 0, 0, 1, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.nx * this.len, this.ny * this.len);
    this.ctx.stroke();
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
