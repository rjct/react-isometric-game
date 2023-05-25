import { Unit } from "./UnitFactory";
import { Firearm } from "./weapon/firearm/FirearmFactory";
import { MeleeWeapon } from "./weapon/melee/MeleeWeaponFactory";
import { FirearmAmmo } from "./weapon/firearm/FirearmAmmoFactory";
import { GameMap } from "./GameMap";

export function createHero(gameMap: GameMap) {
  const hero = new Unit({ unitType: "hero", position: { x: 0, y: 0 } });

  //
  const punch = new MeleeWeapon("punch", gameMap);
  punch.assignUnit(hero);
  hero.putItemToInventory(punch, "rightHand");

  //
  const pistol = new Firearm("pistol", gameMap);

  pistol.ammoCurrent = Array.from({ length: 100 }, () => new FirearmAmmo("pistol"));
  pistol.assignUnit(hero);

  hero.putItemToInventory(pistol, "leftHand");

  //
  const smg = new Firearm("smg", gameMap);
  smg.ammoCurrent = Array.from({ length: 100 }, () => new FirearmAmmo("pistol"));
  smg.assignUnit(hero);

  hero.putItemToInventory(smg, "backpack");

  return hero;
}
