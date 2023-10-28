import { useHero } from "@src/hooks/useHero";

export const VehicleSpeedometer = () => {
  const { hero } = useHero();

  if (!hero.isVehicleInUse()) return null;

  return <div className={"control-vehicle-speedometer"}>{hero.getVehicleInUse()?.speed.current.toFixed(1)}</div>;
};
