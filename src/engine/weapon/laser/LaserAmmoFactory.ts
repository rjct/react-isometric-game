import { AmmoDictEntity, AmmoName } from "@src/dict/ammo/ammo";
import { Ammo } from "@src/engine//weapon/AmmoFactory";
import { constants } from "@src/engine/constants";
import { getDistanceBetweenGridPoints } from "@src/engine/helpers";

export class LaserAmmo extends Ammo {
  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity) {
    super(ammoName, ammoDictEntity);
  }

  getDerivedCssProps() {
    return {
      ...super.getDerivedCssProps(),

      left: this.startPosition.screen.x + constants.tileSize.width / 2,
      top: this.startPosition.screen.y + constants.tileSize.height / 2,
      height:
        getDistanceBetweenGridPoints(this.startPosition.grid, this.targetPosition.grid) *
        constants.wireframeTileSize.width,
      transform: `rotateX(60deg) rotateZ(${this.angle.deg - 45}deg) translateZ(20px)`,
    };
  }
}
