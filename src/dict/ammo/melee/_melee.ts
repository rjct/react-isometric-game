import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import punch from "@src/dict/ammo/melee/punch";
import throwing_knife from "@src/dict/ammo/melee/throwing_knife";

const melee: { [id: string]: AmmoDictEntity } = {
  punch,
  throwing_knife,
};

export default melee;
