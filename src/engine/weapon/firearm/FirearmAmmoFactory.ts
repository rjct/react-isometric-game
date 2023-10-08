import { AmmoDictEntity, AmmoName } from "@src/dict/ammo/ammo";
import { Ammo } from "@src/engine//weapon/AmmoFactory";
import { GameMap } from "@src/engine/gameMap";

export class FirearmAmmo extends Ammo {
  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity, gameState: GameMap) {
    super(ammoName, ammoDictEntity, gameState);
  }
}
