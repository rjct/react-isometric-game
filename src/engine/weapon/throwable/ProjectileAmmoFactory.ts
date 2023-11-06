import { AmmoDictEntity, AmmoName } from "@src/dict/ammo/ammo";
import { Ammo } from "@src/engine//weapon/AmmoFactory";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { screenToGridSpace } from "@src/engine/helpers";

export class ProjectileAmmo extends Ammo {
  private readonly _MAX_HEIGHT: number;
  private readonly _EXPONENT = 2.5;
  private velocity = { x: Infinity, y: Infinity, z: Infinity };
  private _timeElapsed = 0;
  private _timeToReachTarget = 0;
  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity) {
    super(ammoName, ammoDictEntity);

    this._MAX_HEIGHT = Math.pow(this.dictEntity.speed, this._EXPONENT);
  }

  updatePosition(deltaTime: number, gameState: GameMap) {
    if (
      this._timeElapsed >= this._timeToReachTarget ||
      (this.position.grid.x === this.targetPosition.grid.x && this.position.grid.y === this.targetPosition.grid.y)
    ) {
      this.isTargetReached = true;
      this.position = this.targetPosition;

      return;
    }

    const newPositionScreen = this.convert2DToIso(
      this.velocity.x * this._timeElapsed,
      this.velocity.y * this._timeElapsed,
      this.velocity.z * this._timeElapsed -
        (constants.GRAVITY_ACCELERATION * this._MAX_HEIGHT * Math.pow(this._timeElapsed, this._EXPONENT)) / 2,
    );

    const newPosition = {
      x: this.startPosition.screen.x + newPositionScreen.x,
      y: this.startPosition.screen.y + newPositionScreen.y,
    };

    this.position = {
      grid: screenToGridSpace(newPosition, gameState.mapSize),
      screen: newPosition,
    };

    this._timeElapsed += deltaTime;
  }

  shot(initialCoordinates: GridCoordinates, targetCoordinates: GridCoordinates, gameState: GameMap) {
    super.shot(initialCoordinates, targetCoordinates, gameState);

    const positionEnd = {
      x: this.targetPosition.screen.x - this.startPosition.screen.x,
      y: (this.targetPosition.screen.y - this.startPosition.screen.y) * 2,
    };

    const distance = Math.sqrt(positionEnd.x ** 2 + positionEnd.y ** 2);

    this._timeToReachTarget = distance / this.dictEntity.speed / 100;

    this.velocity = {
      x: positionEnd.x / this._timeToReachTarget,
      y: positionEnd.y / this._timeToReachTarget,
      z:
        (constants.GRAVITY_ACCELERATION * this._MAX_HEIGHT * Math.pow(this._timeToReachTarget, this._EXPONENT)) /
        2 /
        this._timeToReachTarget,
    };
  }
}
