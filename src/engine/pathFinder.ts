import pathfinding from "pathfinding";
import { GameMap } from "./GameMap";

export function pathFinder(matrix: GameMap["matrix"], fromPos: GridCoordinates, toPos: GridCoordinates) {
  const grid = new pathfinding.Grid(matrix);
  const finder = new pathfinding.BiAStarFinder({
    diagonalMovement: pathfinding.DiagonalMovement.Never,
    heuristic: pathfinding.Heuristic.euclidean,
  });

  return finder.findPath(Math.round(fromPos.x), Math.round(fromPos.y), Math.round(toPos.x), Math.round(toPos.y), grid);
}
