import { InventoryDetailsRow } from "@src/components/_modals/inventory/_shared/InventoryDetailsRow";
import { AmmoDictEntity, AmmoName, getAmmoDictEntityByType } from "@src/dict/ammo/ammo";
import { WeaponAttackMode, WeaponDictEntity } from "@src/dict/weapon/weapon";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const WeaponDetailsList = React.memo((props: { dictEntity: WeaponDictEntity }) => {
  const { gameDispatch } = useGameState();

  const range = {
    min: Infinity,
    max: -Infinity,
  };

  const damage = {
    min: Infinity,
    max: -Infinity,
  };

  const attackModes = Object.keys(props.dictEntity.attackModes) as WeaponAttackMode[];

  attackModes.forEach((attackMode) => {
    range.min = Math.min(range.min, props.dictEntity.attackModes[attackMode]?.range || 0);
    range.max = Math.max(range.max, props.dictEntity.attackModes[attackMode]?.range || 0);

    damage.min = Math.min(damage.min, props.dictEntity.attackModes[attackMode]?.damage.min || 0);
    damage.max = Math.max(damage.max, props.dictEntity.attackModes[attackMode]?.damage.max || 0);
  });

  const getSupportedAmmo = () => {
    const uniqueAmmo: { [p in AmmoName]: AmmoDictEntity } = {};

    attackModes.forEach((attackMode) => {
      getAmmoDictEntityByType(props.dictEntity.attackModes[attackMode]!.ammoType).forEach((ammoDictEntity) => {
        uniqueAmmo[ammoDictEntity.name] = ammoDictEntity;
      });
    });

    const ammoArr = Object.values(uniqueAmmo)
      .filter((ammo) => !ammo.fakeAmmo)
      .map((ammo) => (
        <a
          key={ammo.title}
          href={""}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            gameDispatch({ type: "setSelectedInventoryItem", item: ammo });
          }}
        >
          {ammo.title}
        </a>
      ));

    return ammoArr.length > 0 ? ammoArr : null;
  };

  return (
    <ul>
      <InventoryDetailsRow label={"Weight"}>{props.dictEntity.weight}</InventoryDetailsRow>
      <InventoryDetailsRow label={"Ammo"}>{getSupportedAmmo()}</InventoryDetailsRow>
      <InventoryDetailsRow label={"Magazine size"}>{props.dictEntity.ammoCapacity}</InventoryDetailsRow>
      <InventoryDetailsRow label={"Price"}>${props.dictEntity.price}</InventoryDetailsRow>
      <InventoryDetailsRow label={"Range"}>
        {range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`}
      </InventoryDetailsRow>
      <InventoryDetailsRow label={"Damage"}>
        {damage.min === damage.max ? `${damage.min}` : `${damage.min}-${damage.max}`}
      </InventoryDetailsRow>
    </ul>
  );
});
