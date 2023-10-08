import { AmmoDictEntity, AmmoName } from "@src/dict/ammo/ammo";
import { Ammo } from "@src/engine//weapon/AmmoFactory";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";

export class ProjectileAmmo extends Ammo {
  private velocity = { x: Infinity, y: Infinity, z: Infinity };
  private _timeElapsed = 0;
  private _timeToReachTarget = 0;
  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity, gameState: GameMap) {
    super(ammoName, ammoDictEntity, gameState);
  }

  updatePosition(deltaTime: number) {
    if (
      this._timeElapsed >= this._timeToReachTarget ||
      (this.position.x === this.targetPosition.x && this.position.y === this.targetPosition.y)
    ) {
      this.isTargetReached = true;
      this.position = this.targetPosition;

      return;
    }

    const newPosition = this.convert2DToIso(
      this.velocity.x * this._timeElapsed,
      this.velocity.y * this._timeElapsed,
      0, //this.velocity.z * this._timeElapsed - (constants.GRAVITY_ACCELERATION * Math.pow(this._timeElapsed, 2)) / 2,
    );

    this.position.x = this.startPosition.x + newPosition.x;
    this.position.y = this.startPosition.y + newPosition.y;

    this._timeElapsed += deltaTime;
  }

  shot(initialCoordinates: GridCoordinates, targetCoordinates: GridCoordinates) {
    super.shot(initialCoordinates, targetCoordinates);

    const positionEnd = {
      x: this.targetPosition.x - this.startPosition.x,
      y: (this.targetPosition.y - this.startPosition.y) * 2,
    };

    const distance = Math.sqrt(positionEnd.x ** 2 + positionEnd.y ** 2);
    const timeToReachTarget = distance / this.dictEntity.speed;

    this._timeToReachTarget = timeToReachTarget;

    this.velocity = {
      x: positionEnd.x / timeToReachTarget,
      y: positionEnd.y / timeToReachTarget,
      z: (constants.GRAVITY_ACCELERATION * Math.pow(timeToReachTarget, 2)) / 2 / timeToReachTarget,
    };
  }
}
