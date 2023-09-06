import { constants } from "@src/constants";
import { Building } from "@src/engine/BuildingFactory";
import { degToRad, getDirectionInDegFromString } from "@src/engine/helpers";
import { LightRay } from "@src/engine/LightRayFactory";
import { DictUnit, Unit } from "@src/engine/UnitFactory";

export class UnitFieldOfViewFactory {
  public position: GridCoordinates;
  public readonly range: number;
  public rays: Array<LightRay> = [];

  private readonly angle: AngleInRadians;
  private readonly angleStep: AngleInRadians;

  constructor(props: { position: GridCoordinates; direction: Direction; fieldOfView: DictUnit["fieldOfView"] }) {
    this.position = props.position;
    this.range = props.fieldOfView.range;
    this.angle = degToRad(props.fieldOfView.angle);
    this.angleStep = degToRad(props.fieldOfView.angle / constants.UNIT_FIELD_OF_VIEW_RAYS);

    this.createRays();
    this.setDirection(getDirectionInDegFromString(props.direction));
  }

  createRays() {
    for (let i = 0; i <= constants.UNIT_FIELD_OF_VIEW_RAYS; i++) {
      this.rays.push(new LightRay({ position: this.position, radius: this.range, color: "#ffffff" }));
    }
  }

  setPosition(position: GridCoordinates) {
    for (const ray of this.rays) {
      ray.setLen(this.range);
      ray.setPosition(position);
    }
  }

  setDirection(angle: number) {
    this.rays.forEach((ray, i) => {
      ray.setDirection(i * this.angleStep + degToRad(angle) - this.angle / 2 + degToRad(180));
    });
  }

  castRays(objects: (Building | Unit)[]) {
    for (const ray of this.rays) {
      ray.setLen(this.range);
      ray.cast(objects);
    }
  }
}
