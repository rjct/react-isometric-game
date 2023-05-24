import { Unit } from "./UnitFactory";
import { Firearm } from "./weapon/firearm/FirearmFactory";
import { MeleeWeapon } from "./weapon/melee/MeleeWeaponFactory";
import { FirearmAmmo } from "./weapon/firearm/FirearmAmmoFactory";

export function createHero() {
  const hero = new Unit({ unitType: "hero", position: { x: 0, y: 0 } });

  //
  const punch = new MeleeWeapon("punch");
  punch.assignUnit(hero);
  hero.putItemToInventory(punch, "rightHand");

  //
  const pistol = new Firearm("pistol");

  pistol.ammoCurrent = Array.from({ length: 100 }, () => new FirearmAmmo("pistol"));
  pistol.assignUnit(hero);

  //hero.hands.left = pistol;
  hero.putItemToInventory(pistol, "leftHand");

  //
  const smg = new Firearm("smg");
  smg.ammoCurrent = Array.from({ length: 100 }, () => new FirearmAmmo("pistol"));
  smg.assignUnit(hero);

  hero.putItemToInventory(smg, "backpack");

  return hero;
}
