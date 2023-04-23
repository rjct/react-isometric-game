import { Unit } from "./UnitFactory";
import { Weapon } from "./WeaponFactory";
import { Ammo } from "./AmmoFactory";

export function createHero() {
  const hero = new Unit({ unitType: "hero", position: { x: 0, y: 0 } });

  //
  const pistol = new Weapon("pistol");

  pistol.ammoCurrent = Array.from({ length: 100 }, () => new Ammo("pistol"));
  pistol.assignUnit(hero);

  //hero.hands.left = pistol;
  hero.putItemToInventory(pistol, "leftHand");

  //
  const smg = new Weapon("smg");
  smg.ammoCurrent = Array.from({ length: 100 }, () => new Ammo("pistol"));
  smg.assignUnit(hero);

  hero.putItemToInventory(smg, "backpack");

  return hero;
}
