import { StaticMapLight } from "@src/context/GameStateContext";
import { GameEntityIntersectionWithLightRay, GameEntityWall } from "@src/engine/GameEntityFactory";
import { getDistanceBetweenGridPoints, randomUUID } from "@src/engine/helpers";

export class Light {
  public readonly id = randomUUID();
  public readonly className = "light";
  public position: GridCoordinates;
  private color = "#ffffff";
  public radius = 6;
  public intersectsWithWalls: GameEntityIntersectionWithLightRay[] = [];

  constructor(props: StaticMapLight) {
    this.position = props.position;

    if (props.color) {
      this.color = props.color;
    }

    if (props.radius) {
      this.radius = props.radius;
    }
  }

  setColor(color: string) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  cast(walls: GameEntityWall[]) {
    const lightPosition = {
      x: this.position.x + 0.5,
      y: this.position.y + 0.5,
    };

    const wallPoints = walls
      .filter((wall) => {
        if (wall.gameEntity.id === "world-walls") return true;

        return (
          getDistanceBetweenGridPoints(
            {
              x: wall.area.world.x1 + (wall.area.world.x2 - wall.area.world.x1),
              y: wall.area.world.y1 + (wall.area.world.y2 - wall.area.world.y1),
            },
            lightPosition,
          ) <= this.radius
        );
      })
      .map((wall) => {
        return [
          { x: wall.area.world.x1, y: wall.area.world.y1 },
          { x: wall.area.world.x2, y: wall.area.world.y2 },
        ];
      })
      .flat();

    const uniqueWallPointAngles = [...new Set(wallPoints.map((wallPoint) => wallPoint))]
      .map((uniqueWallPoint) => {
        return wallPoints.find((wallPoint) => wallPoint.x === uniqueWallPoint.x && wallPoint.y === uniqueWallPoint.y)!;
      })
      .map((uniqueWallPoint) => {
        const angle = Math.atan2(uniqueWallPoint.y - lightPosition.y, uniqueWallPoint.x - lightPosition.x);

        return [angle - 0.00001, angle, angle + 0.00001];
      })
      .flat();

    const intersects = [];
    for (let i = 0; i < uniqueWallPointAngles.length; i++) {
      const angle = uniqueWallPointAngles[i];

      const ray = {
        from: lightPosition,
        to: { x: lightPosition.x + Math.cos(angle), y: lightPosition.y + Math.sin(angle) },
      };

      let closestIntersect = null;
      for (let i = 0; i < walls.length; i++) {
        const intersect = walls[i].getIntersectionWithRay(ray);

        if (!intersect) continue;

        if (!closestIntersect || intersect.param < closestIntersect.param) {
          closestIntersect = intersect;
        }
      }

      if (!closestIntersect) continue;

      closestIntersect.angle = angle;

      intersects.push(closestIntersect);
    }

    this.intersectsWithWalls = intersects.sort(function (a, b) {
      return a.angle - b.angle;
    });
  }

  setPosition(position: GridCoordinates) {
    this.position = position;
  }

  setRadius(radius: number) {
    this.radius = radius;
  }

  getHash() {
    return `${this.position.x}:${this.position.y}:${this.radius}:${this.getColor()}`;
  }
}
