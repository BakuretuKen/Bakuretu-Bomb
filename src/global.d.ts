export {};

declare global {
  interface Window {
    BOMB_GAME_WIDTH: number;
    BOMB_GAME_HEIGHT: number;
    BOMB_GAME_FPS: number;
    BOMB_GAME_BAKURETU_BOMB_RATE: number;
    BOMB_GAME_ANIME_IMAGE?: number;
    BOMB_GAME_ANIME_WAIT?: number;
    BOMB_GAME_ANIME_FRAME?: number;
    BOMB_GAME_ANIME_POSITION_X?: number;
    BOMB_GAME_ANIME_POSITION_Y?: number;
  }
}
