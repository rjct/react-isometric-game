import { Light } from "./LightFactory";
import { constants } from "../constants";
import { Building } from "./BuildingFactory";

export class LightRay {
  x = 0;
  y = 0;
  len = 0;
  nx = 0;
  ny = 0;
  color = "";

  constructor(light: Light) {
    this.setPosition(light.position);
    this.setLen(light.radius);
    this.setColor(light.getColor());
    this.setDirection(0);
  }

  setDirection(dir: number) {
    this.nx = Math.cos(dir);
    this.ny = Math.sin(dir);
  }

  setPosition(position: Coordinates) {
    this.x = position.x * constants.wireframeTileSize.width;
    this.y = position.y * constants.wireframeTileSize.height;
  }

  setLen(lightRadius: number) {
    this.len = lightRadius * constants.wireframeTileSize.width;
  }

  setColor(color: string) {
    this.color = color;
  }

  pathEnd(ctx: CanvasRenderingContext2D) {
    ctx.lineTo(this.nx * this.len, this.ny * this.len);
  }

  draw(ctx: CanvasRenderingContext2D, useGradient = true) {
    let fill: CanvasGradient | string = this.color;

    if (useGradient) {
      fill = ctx.createRadialGradient(0, 0, this.len / 2, 0, 0, this.len);
      fill.addColorStop(0, `${this.color}FF`);
      fill.addColorStop(0.5, `${this.color}80`);
      fill.addColorStop(1, `${this.color}00`);
    }

    ctx.globalAlpha = constants.light.LIGHTS_ALPHA;
    ctx.strokeStyle = fill;
    ctx.lineWidth = 1;
    ctx.setTransform(1, 0, 0, 1, this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.nx * this.len, this.ny * this.len);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = constants.light.SHADOWS_ALPHA;
  }

  cast(objects: Array<Building>) {
    let minDist = this.len;
    let i = objects.length;

    while (i > 0) {
      i -= 1;
      minDist = Math.min(objects[i].rayDist2Polygon(this), minDist);
    }

    this.len = minDist;
  }
}
