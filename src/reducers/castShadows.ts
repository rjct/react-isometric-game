import { GameMap } from "../engine/GameMap";

export interface CastShadowsReducerAction {
  type: "castShadows";
  deltaTime: number;
  //canvasRef: React.RefObject<HTMLCanvasElement>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function castShadows(state: GameMap, action: CastShadowsReducerAction) {
  //const { updateAll } = useShadows({ canvasRef: action.canvasRef });

  //updateAll(action.deltaTime);

  return state;
}
