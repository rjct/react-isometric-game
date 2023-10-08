import { AmmoDictEntity, AmmoName } from "@src/dict/ammo/ammo";
import { GameMap } from "@src/engine/gameMap";
import { Ammo } from "@src/engine/weapon/AmmoFactory";

export class MeleePunch extends Ammo {
  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity, gameState: GameMap) {
    super(ammoName, ammoDictEntity, gameState);
  }
}
