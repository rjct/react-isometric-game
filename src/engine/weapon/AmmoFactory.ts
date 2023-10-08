import { StaticMapWeaponAmmo } from "@src/context/GameStateContext";
import { AmmoDictEntity, AmmoName, WeaponAmmoClass } from "@src/dict/ammo/ammo";
import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints, randomUUID } from "@src/engine/helpers";
import { InventoryItem } from "@src/engine/InventoryItemFactory";

export class Ammo extends InventoryItem {
  readonly class: WeaponAmmoClass;
  readonly id = randomUUID();
  readonly name: AmmoName;
  readonly dictEntity: AmmoDictEntity;
  readonly gameMap: GameMap;

  startPosition: GridCoordinates = { x: Infinity, y: Infinity };
  position: GridCoordinates = { x: Infinity, y: Infinity };
  targetPosition: GridCoordinates = { x: Infinity, y: Infinity };

  shotDistance = 0;

  angle: { rad: number; deg: number } = { rad: Infinity, deg: Infinity };

  isTargetReached = false;

  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity, gameState: GameMap) {
    super();

    this.class = ammoDictEntity.class;
    this.name = ammoName;
    this.dictEntity = ammoDictEntity;
    this.gameMap = gameState;

    this.gameMap.ammo[this.id] = this;
  }

  updatePosition(deltaTime: number) {
    const speed = this.dictEntity.speed * deltaTime; // FIXME: Real speed or time
    const angle = this.angle;

    const x = Math.cos(angle.rad) * speed;
    const y = Math.sin(angle.rad) * speed;

    this.position.x += x;
    this.position.y += y;

    const currentDistance = getDistanceBetweenGridPoints(this.position, this.targetPosition);

    this.isTargetReached = currentDistance <= 1 || currentDistance >= this.shotDistance;

    if (this.isTargetReached) {
      this.position = this.targetPosition;
    }
  }

  shot(initialCoordinates: GridCoordinates, targetCoordinates: GridCoordinates) {
    this.startPosition = { ...initialCoordinates };
    this.position = { ...initialCoordinates };
    this.targetPosition = { ...targetCoordinates };

    this.angle = getAngleBetweenTwoGridPoints(initialCoordinates, targetCoordinates);
    this.shotDistance = getDistanceBetweenGridPoints(initialCoordinates, targetCoordinates);
  }

  convert2DToIso(x: number, y: number, z: number) {
    return {
      x: x,
      y: y / 2 - z,
    };
  }

  afterTargetReached(gameState: GameMap) {
    if (this.dictEntity.sfx?.targetReached) {
      gameState.playSfx(this.dictEntity.sfx.targetReached.src);
    }
  }

  getJSON(): StaticMapWeaponAmmo {
    return {
      class: "ammo",
      name: this.name,
      quantity: 1,
    };
  }
}

export type AmmoFactory = typeof Ammo;
