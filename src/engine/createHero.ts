import { Unit } from "./UnitFactory";
import { Weapon } from "./WeaponFactory";
import { Ammo } from "./AmmoFactory";

export function createHero() {
  const hero = new Unit({ unitType: "hero", position: { x: 0, y: 0 } });

  const pistol = new Weapon("pistol");
  const ammo = Array.from({ length: 100 }, () => new Ammo("pistol"));

  pistol.ammoCurrent = ammo;
  pistol.assignUnit(hero);

  hero.hands.left = pistol;

  return hero;
}
