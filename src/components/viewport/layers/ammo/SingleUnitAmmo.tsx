import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const SingleUnitAmmo = (props: { ammoId?: Ammo["id"] }) => {
  const { gameState } = useGameState();

  const ammo = React.useMemo(() => {
    if (!props.ammoId) return null;

    return gameState.getAmmoById(props.ammoId);
  }, [props.ammoId]);

  if (!ammo) return null;

  return <div className={`ammo`} data-name={ammo.name} style={ammo.getDerivedCssProps()}></div>;
};
