import { radToDeg } from "./helpers";
import ammo from "../dict/ammo.json";
import { nanoid } from "nanoid";

export type AmmoType = "pistol";

export class Ammo {
  public readonly id = nanoid();
  public readonly className = ["ammo"];
  public readonly size: {
    grid: Size;
    screen: Size;
  };

  private readonly speed: number;

  readonly damage: number;

  startPosition: Coordinates = { x: Infinity, y: Infinity };
  position: Coordinates = { x: Infinity, y: Infinity };
  targetPosition: Coordinates = { x: Infinity, y: Infinity };

  angle: { rad: number; deg: number } = { rad: Infinity, deg: Infinity };

  isTargetReached = false;
  constructor(ammoType: AmmoType) {
    const ref = ammo[ammoType];

    this.className = [...this.className, ...ref.className];
    this.size = ref.size;

    this.speed = ref.speed;
    this.damage = ref.damage;
  }

  updatePosition(deltaTime: number) {
    const speed = this.speed * deltaTime;
    const angle = this.angle;

    const x = Math.cos(angle.rad) * speed;
    const y = Math.sin(angle.rad) * speed;

    this.position.x += x;
    this.position.y += y;

    this.isTargetReached = false;

    switch (true) {
      case angle.deg < 0:
        this.isTargetReached = this.position.y < this.targetPosition.y;
        break;

      case angle.deg === 0:
        this.isTargetReached = this.position.x > this.targetPosition.x;
        break;

      case angle.deg <= 90:
        this.isTargetReached = this.position.y > this.targetPosition.y;
        break;

      case angle.deg <= 180:
        this.isTargetReached = this.position.x < this.targetPosition.x;
        break;
    }

    if (this.isTargetReached) {
      this.position = this.targetPosition;
    }
  }

  shot(initialCoordinates: Coordinates, targetCoordinates: Coordinates) {
    this.startPosition = { ...initialCoordinates };
    this.position = { ...initialCoordinates };
    this.targetPosition = { ...targetCoordinates };

    const distance = {
      x: targetCoordinates.x - this.position.x,
      y: targetCoordinates.y - this.position.y,
    };

    const angle: number = Math.atan2(distance.y, distance.x);
    const angleInDeg = radToDeg(angle);

    this.angle = {
      rad: angle,
      deg: angleInDeg,
    };
  }
}
