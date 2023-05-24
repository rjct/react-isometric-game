import { Ammo } from "../AmmoFactory";
import ammo from "../../../dict/ammo.json";

export type MeleePunchType = keyof typeof ammo.melee;
export type MeleePunchRef = (typeof ammo.melee)[MeleePunchType];

export class MeleePunch extends Ammo {
  constructor(type: MeleePunchType) {
    const ref = ammo.melee[type];

    super(ref);
  }
}
