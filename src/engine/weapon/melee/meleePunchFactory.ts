import ammo from "@src/dict/ammo.json";
import { Ammo } from "@src/engine/weapon/AmmoFactory";

export type MeleePunchType = keyof typeof ammo.MeleeWeapon;
export type MeleePunchRef = (typeof ammo.MeleeWeapon)[MeleePunchType];

export class MeleePunch extends Ammo {
  constructor(type: MeleePunchType) {
    const ref = ammo.MeleeWeapon[type];

    super(type, ref);
  }
}
