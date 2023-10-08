import { EffectType } from "@src/context/GameFxContext";
import { randomUUID } from "@src/engine/helpers";

export class Fx {
  id = randomUUID();

  readonly position: GridCoordinates;
  readonly type: EffectType;
  constructor(props: { coordinates: GridCoordinates; type: EffectType }) {
    this.position = props.coordinates;

    this.type = props.type;
  }
}
