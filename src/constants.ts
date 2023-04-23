const tileSize = { width: 72, height: 36 };
const MAGIC_NUMBER = 1.415;

export const constants = {
  BASE_URL: "/react-isometric-game",
  FPS: 24,
  SCROLL_SPEED: 300,
  SCROLL_EDGE_WIDTH: 50,
  OFFSCREEN_TILE_CACHE: 4,
  FOG_OF_WAR_RADIUS: 5,
  miniMap: {
    width: 400,
    height: 200,
    ZOOM: 0.1,
  },
  tileSize,
  wireframeTileSize: {
    width: tileSize.width * (MAGIC_NUMBER / 2),
    height: tileSize.height * MAGIC_NUMBER,
  },

  tile: {
    CLASS_ACTIVE: "active",
    CLASS_OCCUPIED: "occupied",
  },

  unit_css_animation_length: 1000, // ms
};
