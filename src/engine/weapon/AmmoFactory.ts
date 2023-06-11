import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "../helpers";
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

  startPosition: GridCoordinates = { x: Infinity, y: Infinity };
  position: GridCoordinates = { x: Infinity, y: Infinity };
  targetPosition: GridCoordinates = { x: Infinity, y: Infinity };

  shotDistance: number;

  angle: { rad: number; deg: number } = { rad: Infinity, deg: Infinity };

  isTargetReached = false;
  constructor(ammoRef: AmmoRef) {
    this.className = [...this.className, ...ammoRef.className];
    this.size = ammoRef.size;

    this.speed = ammoRef.speed;
    this.damage = ammoRef.damage;

    this.shotDistance = 0;
  }

  updatePosition(deltaTime: number) {
    const speed = this.speed * deltaTime;
    const angle = this.angle;

    const x = Math.cos(angle.rad) * speed;
    const y = Math.sin(angle.rad) * speed;

    this.position.x += x;
    this.position.y += y;

    const currentDistance = getDistanceBetweenGridPoints(this.position, this.targetPosition);

    this.isTargetReached = currentDistance <= 0 || currentDistance >= this.shotDistance;

    if (this.isTargetReached) {
      this.position = this.targetPosition;
    }
  }

  shot(initialCoordinates: GridCoordinates, targetCoordinates: GridCoordinates) {
    this.startPosition = { ...initialCoordinates };
    this.position = { ...initialCoordinates };
    this.targetPosition = { ...targetCoordinates };

    this.angle = getAngleBetweenTwoGridPoints(initialCoordinates, targetCoordinates);
    this.shotDistance = getDistanceBetweenGridPoints(initialCoordinates, targetCoordinates);
  }
}
