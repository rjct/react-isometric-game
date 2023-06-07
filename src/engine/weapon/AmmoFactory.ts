import { getAngleBetweenTwoGridPoints } from "../helpers";
import { FirearmAmmoRef, FirearmAmmoType } from "./firearm/FirearmAmmoFactory";
import { MeleePunchRef, MeleePunchType } from "./melee/meleePunchFactory";

export type AmmoType = FirearmAmmoType | MeleePunchType;
export type AmmoRef = FirearmAmmoRef | MeleePunchRef;

export class Ammo {
  public readonly id = crypto.randomUUID();
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
  constructor(ammoRef: AmmoRef) {
    this.className = [...this.className, ...ammoRef.className];
    this.size = ammoRef.size;

    this.speed = ammoRef.speed;
    this.damage = ammoRef.damage;
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

    this.angle = getAngleBetweenTwoGridPoints(initialCoordinates, targetCoordinates);
  }
}