import frag_grenade from "@src/dict/weapon/throwable/grenade/frag_grenade";
import molotov_cocktail from "@src/dict/weapon/throwable/grenade/molotov_cocktail";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";

export const throwable: { [id: string]: WeaponDictEntity } = {
  molotov_cocktail,
  frag_grenade,
};

export default throwable;
