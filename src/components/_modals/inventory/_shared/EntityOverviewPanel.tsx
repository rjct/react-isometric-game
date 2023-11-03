import { BuildingComponent } from "@src/components/map/buildings/Building";
import { VehicleComponent } from "@src/components/map/vehicles/Vehicle";
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

const getOverviewComponentForEntity = (entity: Unit | Building | Vehicle) => {
  if (entity instanceof Unit) {
    return <UnitOverview entity={entity} />;
  } else if (entity instanceof Building) {
    return <BuildingOverview entity={entity} />;
  } else {
    return <VehicleOverview entity={entity} />;
  }
};

export function EntityOverviewPanel(props: { entity: Unit | Building | Vehicle; className: string[]; title: string }) {
  return (
    <fieldset className={props.className.join(" ")}>
      <legend className={"outlined"}>{props.title}</legend>
      {getOverviewComponentForEntity(props.entity)}
    </fieldset>
  );
}
