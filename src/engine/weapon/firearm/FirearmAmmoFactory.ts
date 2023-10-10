import { AmmoDictEntity, AmmoName } from "@src/dict/ammo/ammo";
import { Ammo } from "@src/engine//weapon/AmmoFactory";

export class FirearmAmmo extends Ammo {
  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity) {
    super(ammoName, ammoDictEntity);
  }
}
