import { Ammo } from "../AmmoFactory";
import ammo from "../../../dict/ammo.json";

export type MeleePunchType = keyof typeof ammo.MeleeWeapon;
export type MeleePunchRef = (typeof ammo.MeleeWeapon)[MeleePunchType];

export class MeleePunch extends Ammo {
  constructor(type: MeleePunchType) {
    const ref = ammo.MeleeWeapon[type];

    super(ref);
  }
}
