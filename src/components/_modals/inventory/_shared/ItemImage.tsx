import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";

export function ItemImage(props: { dictEntity: WeaponDictEntity | AmmoDictEntity }) {
  return <div className={"inventory-item-pic"} data-name={props.dictEntity.name}></div>;
}
