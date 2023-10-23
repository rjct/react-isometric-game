import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import frag_grenade from "@src/dict/ammo/grenade/frag_grenade";
import molotov_cocktail from "@src/dict/ammo/grenade/molotov_cocktail";

const grenade: { [id: string]: AmmoDictEntity } = {
  molotov_cocktail,
  frag_grenade,
};

export default grenade;
