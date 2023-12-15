import { mapsList } from "@src/engine/maps_list";

export type GameFeatureSections = keyof typeof constants.featureEnabled;
export type GameSettingsFeature = keyof typeof constants.featureEnabled.settings;
export type GameDebugFeature = keyof typeof constants.featureEnabled.debug;

const tileSize = {
  width: 72,
  height: 36,
};

const wireframeTileSize = {
  width: tileSize.width * Math.cos((45 * Math.PI) / 180),
  height: tileSize.height * Math.sin((45 * Math.PI) / 180) * 2,
};

const terrainClusterGridSize = {
  width: 8,
  height: 16,
};

const ASSETS_URL = "/assets";

export const constants = {
  STARTING_MAP: mapsList.road,
  BASE_URL: "",
  ASSETS_URL,
  SPRITE_URL: `${ASSETS_URL}/terrain/%SPRITE_FILE_NAME%.webp`,
  FPS: 24,
  SCROLL_SPEED: 300,
  SCROLL_EDGE_WIDTH: 50,
  OFFSCREEN_TILE_CACHE: 4,
  FOG_OF_WAR_OPACITY: 1,
  INTRO_SCENE_DISPLAY_TIME: 6000,
  TERRAIN_CLUSTER_SIZE: {
    grid: {
      width: terrainClusterGridSize.width,
      height: terrainClusterGridSize.height,
    },
    screen: {
      width: terrainClusterGridSize.width * tileSize.width,
      height: terrainClusterGridSize.height * tileSize.height,
    },
  },
  miniMap: {
    size: {
      width: 250,
      height: 250,
    },
    ZOOM: 0.125,
  },
  tileSize,
  wireframeTileSize,

  editor: {
    propsEditor: { width: 300 },
    entitiesLibrary: { left: 10, width: 400, height: "20vh" },
  },

  debug: false,

  featureEnabled: {
    settings: {
      fogOfWar: true,
      light: true,
      shadow: true,
      unitShadow: false,
    },

    debug: {
      skipIntro: false,
      wireframe: true,
      buildingBoxes: false,
      occupiedCells: false,
      unitPath: false,
      unitFieldOfView: true,
      unitShadowVectors: false,
      unitInfo: false,
    },
  },

  sfx: {
    ui: {
      button: "/assets/UI/button.m4a",
      switch: "/assets/UI/switch.m4a",
      tab: "/assets/UI/tab.m4a",
    },
  },

  GRAVITY_ACCELERATION: 9.81,
};
