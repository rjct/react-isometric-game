import beretta_M92FS from "@src/dict/weapon/firearm/pistol/beretta_M92FS";
import colt_45 from "@src/dict/weapon/firearm/pistol/colt_45";
import laser_rifle from "@src/dict/weapon/firearm/rifle/laser_rifle";
import sniper_rifle from "@src/dict/weapon/firearm/rifle/sniper_rifle";
import mp5 from "@src/dict/weapon/firearm/smg/MP5_H&K";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";

export const firearm: { [id: string]: WeaponDictEntity } = {
  beretta_M92FS,
  colt_45,
  //
  mp5,
  //
  sniper_rifle,
  laser_rifle,
};

export default firearm;
