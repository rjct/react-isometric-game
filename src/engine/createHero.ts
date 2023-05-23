import { Unit } from "./UnitFactory";
import { Firearm } from "./weapon/FirearmFactory";
import { Ammo } from "./AmmoFactory";

export function createHero() {
  const hero = new Unit({ unitType: "hero", position: { x: 0, y: 0 } });

  //
  const pistol = new Firearm("pistol");

  pistol.ammoCurrent = Array.from({ length: 100 }, () => new Ammo("pistol"));
  pistol.assignUnit(hero);

  //hero.hands.left = pistol;
  hero.putItemToInventory(pistol, "leftHand");

  //
  const smg = new Firearm("smg");
  smg.ammoCurrent = Array.from({ length: 100 }, () => new Ammo("pistol"));
  smg.assignUnit(hero);

  hero.putItemToInventory(smg, "backpack");

  return hero;
}
