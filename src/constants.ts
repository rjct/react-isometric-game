const tileSize = {
  width: 72,
  height: 36,
};

const wireframeTileSize = {
  width: tileSize.width * Math.cos((45 * Math.PI) / 180),
  height: tileSize.height * Math.sin((45 * Math.PI) / 180) * 2,
};

export const constants = {
  BASE_URL: "/react-isometric-game",
  SPRITE_URL: "public/assets/terrain/%SPRITE_FILE_NAME%.webp",
  FPS: 24,
  SCROLL_SPEED: 300,
  SCROLL_EDGE_WIDTH: 50,
  OFFSCREEN_TILE_CACHE: 4,
  FOG_OF_WAR_RADIUS: 5,
  LIGHT_RENDER_PASSES: 2,
  miniMap: {
    width: 400,
    height: 200,
    ZOOM: 0.1,
  },
  tileSize,
  wireframeTileSize,

  editor: {
    propsEditor: { width: 300 },
    entitiesLibrary: { height: 200 },
  },
};
