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

export const constants = {
  STARTING_MAP: mapsList.vault,
  BASE_URL: "/react-isometric-game",
  SPRITE_URL: "public/assets/terrain/%SPRITE_FILE_NAME%.webp",
  FPS: 24,
  SCROLL_SPEED: 300,
  SCROLL_EDGE_WIDTH: 50,
  OFFSCREEN_TILE_CACHE: 4,
  FOG_OF_WAR_RADIUS: 10,
  FOG_OF_WAR_OPACITY: 1,
  UNIT_FIELD_OF_VIEW_RAYS: 20,
  LIGHT_RENDER_PASSES: 2,
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
      width: 40,
      height: 40,
    },
    ZOOM: 0.125,
  },
  tileSize,
  wireframeTileSize,

  editor: {
    propsEditor: { width: 300 },
    entitiesLibrary: { left: 10, width: 400, height: "20vh" },
  },

  debug: true,

  featureEnabled: {
    settings: {
      fogOfWar: true,
      light: true,
      shadow: true,
      unitShadow: true,
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
      button: "public/assets/UI/button.m4a",
      switch: "public/assets/UI/switch.m4a",
      tab: "public/assets/UI/tab.m4a",
    },
  },

  GRAVITY_ACCELERATION: 9.81,
};
