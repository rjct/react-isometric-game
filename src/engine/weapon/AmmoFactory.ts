import { StaticMapWeaponAmmo } from "@src/context/GameStateContext";
import { AmmoDictEntity, AmmoName, WeaponAmmoClass } from "@src/dict/ammo/ammo";
import { GameMap } from "@src/engine/gameMap";
import {
  getAngleBetweenTwoGridPoints,
  getDistanceBetweenGridPoints,
  gridToScreenSpace,
  randomUUID,
} from "@src/engine/helpers";
import { InventoryItem } from "@src/engine/InventoryItemFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class Ammo extends InventoryItem {
  readonly class: WeaponAmmoClass;
  readonly id = randomUUID();
  readonly name: AmmoName;
  readonly dictEntity: AmmoDictEntity;

  loadedInWeapon: Weapon | null = null;

  startPosition: { grid: GridCoordinates; screen: ScreenCoordinates } = {
    grid: { x: Infinity, y: Infinity },
    screen: { x: Infinity, y: Infinity },
  };
  position: { grid: GridCoordinates; screen: ScreenCoordinates } = {
    grid: { x: Infinity, y: Infinity },
    screen: { x: Infinity, y: Infinity },
  };
  targetPosition: { grid: GridCoordinates; screen: ScreenCoordinates } = {
    grid: { x: Infinity, y: Infinity },
    screen: { x: Infinity, y: Infinity },
  };

  shotDistance = 0;
  angle: { rad: number; deg: number } = { rad: Infinity, deg: Infinity };

  isTargetReached = false;

  constructor(ammoName: AmmoName, ammoDictEntity: AmmoDictEntity) {
    super();

    this.class = ammoDictEntity.class;
    this.name = ammoName;
    this.dictEntity = ammoDictEntity;
  }

  updatePosition(deltaTime: number, gameState: GameMap) {
    const speed = this.dictEntity.speed * deltaTime;
    const angle = this.angle;

    const x = Math.cos(angle.rad) * speed;
    const y = Math.sin(angle.rad) * speed;

    const newPositionGrid = {
      x: this.position.grid.x + x,
      y: this.position.grid.y + y,
    };

    this.position = {
      grid: newPositionGrid,
      screen: gridToScreenSpace(newPositionGrid, gameState.mapSize),
    };

    const currentDistance = getDistanceBetweenGridPoints(this.position.grid, this.targetPosition.grid);

    this.isTargetReached = currentDistance <= 1 || currentDistance >= this.shotDistance;

    if (this.isTargetReached) {
      this.position = this.targetPosition;
    }
  }

  shot(initialCoordinates: GridCoordinates, targetCoordinates: GridCoordinates, gameState: GameMap) {
    this.startPosition = {
      grid: { ...initialCoordinates },
      screen: gridToScreenSpace({ ...initialCoordinates }, gameState.mapSize),
    };

    this.position = {
      grid: { ...initialCoordinates },
      screen: gridToScreenSpace({ ...initialCoordinates }, gameState.mapSize),
    };

    this.targetPosition = {
      grid: { ...targetCoordinates },
      screen: gridToScreenSpace({ ...targetCoordinates }, gameState.mapSize),
    };

    this.angle = getAngleBetweenTwoGridPoints(initialCoordinates, targetCoordinates);
    this.shotDistance = getDistanceBetweenGridPoints(initialCoordinates, targetCoordinates);

    gameState.ammoFiredIds.push(this.id);
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

    this.loadedInWeapon?.onAfterAmmoReachedTarget(this, gameState);

    gameState.ammoFiredIds = [...gameState.ammoFiredIds.filter((id) => id !== this.id)];
    delete gameState.ammo[this.id];
  }

  getJSON(): StaticMapWeaponAmmo {
    return {
      class: this.class,
      name: this.name,
      quantity: 1,
    };
  }
}

export type AmmoFactory = typeof Ammo;
