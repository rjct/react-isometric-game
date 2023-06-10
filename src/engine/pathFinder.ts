import pathfinding from "pathfinding";
import { GameMap } from "./GameMap";
import { floor } from "./helpers";

export function pathFinder(matrix: GameMap["matrix"], fromPos: GridCoordinates, toPos: GridCoordinates) {
  const grid = new pathfinding.Grid([...matrix]);
  const finder = new pathfinding.BestFirstFinder({
    diagonalMovement: pathfinding.DiagonalMovement.Never,
    heuristic: pathfinding.Heuristic.euclidean,
    weight: 1,
  });

  return finder.findPath(floor(fromPos.x), floor(fromPos.y), floor(toPos.x), floor(toPos.y), grid);
}
