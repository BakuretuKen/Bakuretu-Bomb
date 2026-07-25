/**
 * ゲーム設定
 * HTML 側で定義されたグローバル変数を読み込む（enchant.js 版と同じ設定方法）
 */

type RequiredConfigKey =
  | 'BOMB_GAME_WIDTH'
  | 'BOMB_GAME_HEIGHT'
  | 'BOMB_GAME_FPS'
  | 'BOMB_GAME_BAKURETU_BOMB_RATE';

// 必須設定が HTML で未定義のまま起動すると NaN サイズ等で無言で壊れるため、明示的にエラーにする
function requiredConfig(name: RequiredConfigKey): number {
  const value = window[name];
  if (typeof value !== 'number') {
    throw new Error(`${name} が HTML で定義されていません`);
  }
  return value;
}

export const BOMB_GAME_WIDTH = requiredConfig('BOMB_GAME_WIDTH');
export const BOMB_GAME_HEIGHT = requiredConfig('BOMB_GAME_HEIGHT');
export const BOMB_GAME_FPS = requiredConfig('BOMB_GAME_FPS');
export const BOMB_GAME_BAKURETU_BOMB_RATE = requiredConfig('BOMB_GAME_BAKURETU_BOMB_RATE');

// アニメーション設定（未定義時は enchant.js 版と同じ既定値）
export const BOMB_GAME_ANIME_IMAGE = window.BOMB_GAME_ANIME_IMAGE ?? 0; // アニメーション画像数（0以外でアニメーション有効）
export const BOMB_GAME_ANIME_WAIT = window.BOMB_GAME_ANIME_WAIT ?? 80; // アニメーション待ち時間
export const BOMB_GAME_ANIME_FRAME = window.BOMB_GAME_ANIME_FRAME ?? 1; // アニメーションフレーム間隔（アニメ速度）
export const BOMB_GAME_ANIME_POSITION_X = window.BOMB_GAME_ANIME_POSITION_X ?? 0; // アニメーション位置X
export const BOMB_GAME_ANIME_POSITION_Y = window.BOMB_GAME_ANIME_POSITION_Y ?? 0; // アニメーション位置Y
