import { Building } from "@src/engine/BuildingFactory";
import { degToRad } from "@src/engine/helpers";
import { LightRay } from "@src/engine/light/LightRayFactory";
import { DictUnit, Unit } from "@src/engine/unit/UnitFactory";

export class UnitFieldOfViewFactory {
  public position: GridCoordinates;
  public readonly range: number;
  public rays: Array<LightRay> = [];

  private readonly sectorAngle: Angle;
  private directionAngle: Angle = { deg: 0, rad: 0 };
  private readonly angleStep: AngleInRadians;
  public readonly raysCount: number;

  constructor(props: { position: GridCoordinates; directionAngle: Angle; fieldOfView: DictUnit["fieldOfView"] }) {
    this.position = props.position;
    this.range = props.fieldOfView.range;
    this.sectorAngle = {
      deg: props.fieldOfView.sectorAngle,
      rad: degToRad(props.fieldOfView.sectorAngle),
    };
    this.raysCount = this.calculateRaysForSector();
    this.angleStep = this.sectorAngle.rad / this.raysCount;

    this.createRays();
    this.setDirectionAngle(props.directionAngle);
  }

  createRays() {
    for (let i = 0; i <= this.raysCount; i++) {
      this.rays.push(new LightRay({ position: this.position, radius: this.range, color: "#ffffff" }));
    }
  }

  setPosition(position: GridCoordinates) {
    for (const ray of this.rays) {
      ray.setPosition(position);
    }
  }

  setDirectionAngle(angle: Angle) {
    this.directionAngle = angle;

    this.rays.forEach((ray, i) => {
      ray.setDirection(i * this.angleStep + angle.rad - this.sectorAngle.rad / 2 + degToRad(180));
    });
  }

  castRays(objects: (Building | Unit)[]) {
    for (const ray of this.rays) {
      ray.setLen(this.range);
      ray.cast(objects);
    }
  }

  private calculateRaysForSector(): number {
    return Math.ceil(this.range * Math.sin(this.sectorAngle.rad / 2) * 2);
  }
}
