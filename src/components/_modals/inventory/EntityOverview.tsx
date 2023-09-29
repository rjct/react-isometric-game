import { BuildingComponent } from "@src/components/map/buildings/Building";
import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";

const UnitOverview = (props: { entity: Unit }) => {
  return (
    <div className="entity-preview unit-preview">
      <div
        className={["unit", props.entity.className].join(" ")}
        data-direction={props.entity.direction}
        data-action="none"
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

export function EntityOverview(props: { entity: Unit | Building; className: string[]; title: string }) {
  return (
    <fieldset className={props.className.join(" ")}>
      <legend>{props.title}</legend>
      {props.entity instanceof Unit ? (
        <UnitOverview entity={props.entity} />
      ) : (
        <BuildingOverview entity={props.entity} />
      )}
    </fieldset>
  );
}
