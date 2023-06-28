import { constants } from "../constants";
import { Building } from "./BuildingFactory";
import { Unit } from "./UnitFactory";

export type LightRayData = Pick<LightRay, "x" | "y" | "nx" | "ny" | "len" | "color">;

export class LightRay {
  x = 0;
  y = 0;
  len = 0;
  nx = 0;
  ny = 0;
  color = "";
  angle = 0;
  collidedWithEntity: Building | Unit | null = null;

  constructor(props: { position: GridCoordinates; radius: number; color: string }) {
    this.setPosition(props.position);
    this.setLen(props.radius);
    this.setColor(props.color);
    this.setDirection(0);
  }

  setDirection(dir: number) {
    this.angle = dir;
    this.nx = Math.cos(dir);
    this.ny = Math.sin(dir);
  }

  setPosition(position: GridCoordinates) {
    this.x = position.x * constants.wireframeTileSize.width + constants.wireframeTileSize.width / 2;
    this.y = position.y * constants.wireframeTileSize.height + constants.wireframeTileSize.height / 2;
  }

  setLen(lightRadius: number) {
    this.len = lightRadius * constants.wireframeTileSize.width;
  }

  setColor(color: string) {
    this.color = color;
  }

  static pathEnd(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, rayData: LightRayData) {
    ctx.lineTo(rayData.nx * rayData.len, rayData.ny * rayData.len);
  }

  static draw(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    rayData: LightRayData,
    useGradient: boolean
  ) {
    let fill: CanvasGradient | string = rayData.color;

    if (useGradient) {
      fill = ctx.createRadialGradient(0, 0, rayData.len / 2, 0, 0, rayData.len);
      fill.addColorStop(0, `${rayData.color}FF`);
      fill.addColorStop(0.5, `${rayData.color}80`);
      fill.addColorStop(1, `${rayData.color}00`);
    }

    ctx.strokeStyle = fill;
    ctx.lineWidth = 1;
    ctx.setTransform(1, 0, 0, 1, rayData.x, rayData.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rayData.nx * rayData.len, rayData.ny * rayData.len);
    ctx.closePath();
    ctx.stroke();
  }

  cast(entities: Array<Building | Unit>) {
    let minDist = this.len;
    let collidedWithEntity = null;
    this.collidedWithEntity = null;

    for (const entity of entities) {
      const d = entity.rayDist2Polygon(this);

      if (d.distance < minDist) {
        minDist = d.distance;
        collidedWithEntity = d.entity;
      }
    }

    this.len = minDist;
    this.collidedWithEntity = collidedWithEntity;
  }

  getRayData(): LightRayData {
    return {
      x: this.x,
      y: this.y,
      nx: this.nx,
      ny: this.ny,
      len: this.len,
      color: this.color,
    };
  }
}
