import { Ammo } from "../AmmoFactory";
import ammo from "../../../dict/ammo.json";

export type FirearmAmmoType = keyof typeof ammo.firearm;
export type FirearmAmmoRef = (typeof ammo.firearm)[FirearmAmmoType];

export class FirearmAmmo extends Ammo {
  constructor(ammoType: FirearmAmmoType) {
    const ref = ammo.firearm[ammoType];

    super(ref);
  }
}
