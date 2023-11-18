import { VehicleGearShift } from "@src/components/controlPanel/vehicle/VehicleGearShift";
import { VehicleSpeedometer } from "@src/components/controlPanel/vehicle/VehicleSpeedometer";
import { useHero } from "@src/hooks/useHero";

export const VehicleDashboard = () => {
  const { hero } = useHero();

  const vehicle = hero.getVehicleInUse()!;

  if (!hero.isVehicleInUse()) return null;

  return (
    <div className={"control-vehicle"}>
      <VehicleSpeedometer vehicle={vehicle} />
      <VehicleGearShift vehicle={vehicle} />
    </div>
  );
};
