import { Building } from "../engine/BuildingFactory";
import { constants } from "../constants";
import { Unit } from "../engine/UnitFactory";

export interface ShadowRay {
  ray: Ray;
  gradient: CanvasGradient;
  size: Size;
}

export class Ray {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  private dir: number;
  len: number;
  nx = 0;
  ny = 0;
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number, len: number) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.len = len;

    this.setDir(dir);
  }

  setDir(dir: number) {
    this.nx = Math.cos(dir);
    this.ny = Math.sin(dir);
  }

  pathEnd() {
    this.ctx.lineTo(this.nx * this.len, this.ny * this.len);
  }

  draw(color: CanvasGradient, width: number) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.setTransform(1, 0, 0, 1, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.nx * this.len, this.ny * this.len);
    this.ctx.stroke();
  }
}

const castRay = function (ray: Ray, objects: Array<Unit | Building>) {
  let minDist = ray.len; // set the min dist to the rays length
  let i = objects.length; // number of objects to check

  while (i > 0) {
    i -= 1;
    minDist = Math.min(objects[i].rayDist2Polygon(ray), minDist);
  }

  ray.len = minDist;
};

export function useShadows() {
  const RAY_LINE_WIDTH = 40;
  const NUMBER_RAYS = 512;
  const RAY_DIR_SPACING = Math.PI / (NUMBER_RAYS / 2);
  const RAY_ROTATE_SPEED = Math.PI * 2; // / 51000;

  const createRay = (canvas: HTMLCanvasElement, position: Coordinates, size: Size): ShadowRay => {
    const ctx = canvas.getContext("2d")!;

    const width = size.width * constants.wireframeTileSize.width;
    const height = size.height * constants.wireframeTileSize.height;

    const screenDiagonal = Math.hypot(width, height);

    const gradient = ctx.createRadialGradient(0, 0, screenDiagonal / 8, 0, 0, 0);
    gradient.addColorStop(0, "rgba(0, 0 ,255, 0)");
    gradient.addColorStop(0.5, "rgba(240,4,0,0.5)");
    gradient.addColorStop(0.75, "rgba(239,202,77,0.51)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    // const gradient = ctx.createRadialGradient(0, 0, screenDiagonal / 8, 0, 0, 0);
    // gradient.addColorStop(0, "rgba( 0, 0, 0,  0 )");
    // gradient.addColorStop(0.5, "rgba( 0, 0, 0, .8 )");
    // gradient.addColorStop(1, "rgba( 0, 0, 0,  1 )");

    const ray = new Ray(
      ctx,
      position.x * constants.wireframeTileSize.width,
      position.y * constants.wireframeTileSize.height,
      0,
      screenDiagonal
    );

    return {
      ray,
      gradient,
      size: { width, height },
    };
  };

  const updateRays = (
    canvas: HTMLCanvasElement,
    rays: Array<{ unit: Unit; shadowRay: ShadowRay }>,
    objects: Array<Unit | Building>,
    time = 0.5
  ) => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    rays.forEach((item) => {
      const { unit, shadowRay } = item;

      const width = shadowRay.size.width;
      const height = shadowRay.size.height;

      const screenDiagonal = Math.hypot(width, height);

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      shadowRay.ray.x = unit.position.x * constants.wireframeTileSize.width;
      shadowRay.ray.y = unit.position.y * constants.wireframeTileSize.height;

      ctx.setTransform(1, 0, 0, 1, shadowRay.ray.x, shadowRay.ray.y);
      ctx.beginPath();
      //ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = shadowRay.gradient;

      let i = 0;

      while (i < NUMBER_RAYS) {
        shadowRay.ray.setDir(i * time * RAY_DIR_SPACING * RAY_ROTATE_SPEED);

        shadowRay.ray.len = screenDiagonal;

        castRay(shadowRay.ray, objects);

        shadowRay.ray.pathEnd();
        shadowRay.ray.draw(shadowRay.gradient, RAY_LINE_WIDTH);
        i++;
      }
    });

    ctx.fill();
  };

  return { createRay, updateRays };
}
