import { Building } from "@src/engine/building/BuildingFactory";
import { degToRad, floor, normalizeAngle } from "@src/engine/helpers";
import { LightRay } from "@src/engine/light/LightRayFactory";

import { UnitDictEntity } from "@src/dict/unit/_unit";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export class UnitFieldOfViewFactory {
  public position: GridCoordinates;
  public readonly range: number;
  public rays: Array<LightRay> = [];

  private readonly sectorAngle: Angle;
  private rotation: Angle = { deg: 0, rad: 0 };
  private readonly angleStep: AngleInRadians;
  public readonly raysCount: number;

  public cellsInView: Array<GridCoordinates> = [];
  public entitiesInView: { [id: string]: Building | Unit | Vehicle } = {};

  constructor(props: { position: GridCoordinates; rotation: Angle; fieldOfView: UnitDictEntity["fieldOfView"] }) {
    this.position = props.position;
    this.range = props.fieldOfView.range;
    this.sectorAngle = {
      deg: props.fieldOfView.sectorAngle,
      rad: degToRad(props.fieldOfView.sectorAngle),
    };
    this.raysCount = this.calculateRaysForSector();
    this.angleStep = this.sectorAngle.rad / this.raysCount;

    this.createRays();
    this.setRotation(props.rotation);
  }

  createRays() {
    for (let i = 0; i <= this.raysCount; i++) {
      this.rays.push(new LightRay({ position: this.position, radius: this.range, color: "#ffffff" }));
    }
  }

  setPosition(position: GridCoordinates, gameState: GameMap) {
    this.position = position;

    for (const ray of this.rays) {
      ray.setPosition(position);
    }

    this.cellsInView = this.getCellsInSector(gameState);
  }

  setRotation(angle: Angle) {
    const correctedAngle: Angle = {
      deg: angle.deg - 90,
      rad: angle.rad - degToRad(90),
    };
    this.rotation = correctedAngle;

    this.rays.forEach((ray, i) => {
      ray.setRotation(i * this.angleStep + correctedAngle.rad - this.sectorAngle.rad / 2);
    });
  }

  castRays(objects: (Building | Unit | Vehicle)[]) {
    this.entitiesInView = {};

    for (const ray of this.rays) {
      ray.setLen(this.range);
      const entityInView = ray.cast(objects);

      if (entityInView) {
        this.entitiesInView[entityInView.id] = entityInView;
      }
    }
  }

  isEntityInView(entity: Building | Unit | Vehicle) {
    return !!this.entitiesInView[entity.id] || !entity.blocksRays;
  }

  private getCellsInSector(gameState: GameMap) {
    const cellsInSector: GridCoordinates[] = [];
    const x = floor(this.position.x);
    const y = floor(this.position.y);

    for (let i = -this.range; i <= this.range; i++) {
      for (let j = -this.range; j <= this.range; j++) {
        const distance = Math.sqrt(i * i + j * j);

        if (distance <= this.range) {
          const cellX = x + i;
          const cellY = y + j;

          if (cellX < 0 || cellY < 0 || cellX >= gameState.mapSize.width || cellY >= gameState.mapSize.height) continue;

          const cellAngle: Angle = {
            deg: Math.atan2(cellY - y, cellX - x) * (180 / Math.PI),
            rad: Math.atan2(cellY - y, cellX - x),
          };
          const normalizedDirectionAngle = normalizeAngle(this.rotation);
          const normalizedCellAngle = normalizeAngle(cellAngle);

          let angleDifference = Math.abs(normalizedDirectionAngle.rad - normalizedCellAngle.rad);

          if (angleDifference > Math.PI) {
            angleDifference = 2 * Math.PI - angleDifference;
          }

          if (angleDifference <= this.sectorAngle.rad / 2) {
            cellsInSector.push({ x: cellX, y: cellY });
          }
        }
      }
    }

    return cellsInSector;
  }

  private calculateRaysForSector(): number {
    return Math.ceil(this.range * Math.sin(this.sectorAngle.rad / 2) * 5);
  }
}
