import { LabelWithValue } from "@src/components/ui/LabelWithValue";
import { BuildingComponent } from "@src/components/viewport/layers/userInteraction/buildings/Building";
import { VehicleComponent } from "@src/components/viewport/layers/userInteraction/vehicles/Vehicle";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { Building } from "@src/engine/building/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

const UnitOverview = (props: { entity: Unit }) => {
  return (
    <div className="entity-preview unit-preview">
      <div
        className={["unit", props.entity.className].join(" ")}
        data-rotation={props.entity.rotation.deg}
        data-action={props.entity.action}
      >
        <div className="char"></div>
      </div>

      <div className={"stats"}>
        <LabelWithValue title={"LVL"} value={props.entity.characteristics.level} />
        <LabelWithValue title={"XP"} value={props.entity.characteristics.xp} />
      </div>
    </div>
  );
};

const BuildingOverview = (props: { entity: Building }) => {
  return (
    <div className="entity-preview building-preview">
      <BuildingComponent building={props.entity} />
    </div>
  );
};

const VehicleOverview = (props: { entity: Vehicle }) => {
  return (
    <div className="entity-preview vehicle-preview">
      <VehicleComponent vehicle={props.entity} />
    </div>
  );
};

const getOverviewComponentForEntity = (entity: GameEntity) => {
  if (entity instanceof Unit) {
    return <UnitOverview entity={entity} />;
  } else if (entity instanceof Building) {
    return <BuildingOverview entity={entity} />;
  } else {
    return <VehicleOverview entity={entity as Vehicle} />;
  }
};

export function EntityOverviewPanel(props: { entity: GameEntity; className: string[]; title: string }) {
  return (
    <fieldset className={props.className.join(" ")}>
      <legend className={"outlined"}>{props.title}</legend>
      {getOverviewComponentForEntity(props.entity)}
    </fieldset>
  );
}
