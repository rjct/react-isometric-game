import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export function ItemImage(props: { item: Weapon | Ammo }) {
  return <div className={"inventory-item-pic"} data-name={props.item.name}></div>;
}
