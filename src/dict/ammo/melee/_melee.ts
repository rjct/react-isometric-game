import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import punch from "@src/dict/ammo/melee/punch";

const melee: { [id: string]: AmmoDictEntity } = {
  punch: punch,
};

export default melee;
