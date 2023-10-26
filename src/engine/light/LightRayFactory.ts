import { Building } from "@src/engine/BuildingFactory";
import { constants } from "@src/engine/constants";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export class LightRay {
  position: {
    grid: GridCoordinates;
    screen: ScreenCoordinates;
  } = {
    grid: { x: 0, y: 0 },
    screen: { x: 0, y: 0 },
  };
  len = {
    grid: 0,
    screen: 0,
  };
  n: {
    grid: { x: number; y: number };
    screen: { x: number; y: number };
  } = {
    grid: { x: 0, y: 0 },
    screen: { x: 0, y: 0 },
  };

  color = "";
  angle: AngleInRadians = 0;
  collidedWithEntity: Building | Unit | Vehicle | null = null;

  constructor(props: { position: GridCoordinates; radius: number; color: string }) {
    this.setPosition(props.position);
    this.setLen(props.radius);
    this.setColor(props.color);
    this.setRotation(0);
  }

  setRotation(angle: AngleInRadians) {
    this.angle = angle;

    this.n = {
      grid: { x: Math.cos(angle), y: Math.sin(angle) },
      screen: { x: Math.cos(angle), y: Math.sin(angle) },
    };
  }

  setPosition(position: GridCoordinates) {
    this.position = {
      grid: {
        x: position.x + 0.5,
        y: position.y + 0.5,
      },
      screen: {
        x: (position.x + 0.5) * constants.wireframeTileSize.width,
        y: (position.y + 0.5) * constants.wireframeTileSize.height,
      },
    };
  }

  setLen(len: number) {
    this.len = {
      grid: len,
      screen: len * constants.wireframeTileSize.width,
    };
  }

  setColor(color: string) {
    this.color = color;
  }

  cast(entities: Array<Building | Unit | Vehicle>) {
    let minDist = this.len.grid;
    let collidedWithEntity = null;
    this.collidedWithEntity = null;

    for (const entity of entities) {
      const d = entity.rayDist2Polygon(this);

      if (d.distance < minDist) {
        minDist = d.distance;
        collidedWithEntity = d.entity;
      }
    }

    this.len = {
      grid: minDist,
      screen: minDist * constants.wireframeTileSize.width,
    };
    this.collidedWithEntity = collidedWithEntity;

    return collidedWithEntity;
  }
}
