import { Ammo } from "../AmmoFactory";
import ammo from "../../../dict/ammo.json";

export type FirearmAmmoType = keyof typeof ammo.FirearmAmmo;
export type FirearmAmmoRef = (typeof ammo.FirearmAmmo)[FirearmAmmoType];

export class FirearmAmmo extends Ammo {
  constructor(ammoType: FirearmAmmoType) {
    const ref = ammo.FirearmAmmo[ammoType];

    super(ammoType, ref);
  }
}
