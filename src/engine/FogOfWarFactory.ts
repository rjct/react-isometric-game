import { constants } from "@src/engine/constants";
import { Unit } from "@src/engine/unit/UnitFactory";

export class FogOfWar {
  private canvas: OffscreenCanvas;
  private ctx: OffscreenCanvasRenderingContext2D;
  private bg = "";

  private readonly size: Size2D;
  constructor(props: { size: Size2D }) {
    this.size = props.size;
    this.canvas = new OffscreenCanvas(props.size.width, props.size.height);
    this.ctx = this.canvas.getContext("2d")!;
  }

  async render(hero: Unit): Promise<FogOfWar["bg"]> {
    const hideFill = `rgba(0, 0, 0, ${constants.FOG_OF_WAR_OPACITY})`;
    const { ctx } = this;
    const { width, height } = this.size;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = hideFill;
    ctx.lineWidth = 0;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "destination-out";

    const { x, y } = hero.position.grid;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (const ray of hero.fieldOfView.rays) {
      ctx.lineTo(
        Math.max(0, Math.min(Math.round(ray.n.grid.x * ray.len.grid) + ray.position.grid.x, width)),
        Math.max(0, Math.min(Math.round(ray.n.grid.y * ray.len.grid) + ray.position.grid.y, height)),
      );
    }

    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.ellipse(x, y, 1, 3, -Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();

    //
    const blob = await this.canvas.convertToBlob();

    this.bg = window.URL.createObjectURL(blob);

    return this.bg;
  }
}
