import ammo from "@src/dict/ammo.json";
import { Ammo } from "@src/engine//weapon/AmmoFactory";

export type FirearmAmmoType = keyof typeof ammo.FirearmAmmo;
export type FirearmAmmoRef = (typeof ammo.FirearmAmmo)[FirearmAmmoType];

export class FirearmAmmo extends Ammo {
  constructor(ammoType: FirearmAmmoType) {
    const ref = ammo.FirearmAmmo[ammoType];

    super(ammoType, ref);
  }
}
