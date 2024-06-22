import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";
import { constants } from "@src/engine/constants";

export function ItemImage(props: { dictEntity: WeaponDictEntity | AmmoDictEntity }) {
  return (
    <div
      className={"inventory-item-pic"}
      data-name={props.dictEntity.name}
      style={{
        backgroundImage: `url(${constants.BASE_URL}${props.dictEntity.gfx?.icon.src})`,
      }}
    ></div>
  );
}
