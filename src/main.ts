import Phaser from 'phaser';
import { BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT } from './config';
import { GameScene } from './GameScene';

// スマホ判定（enchant.js 版と同じ判定。スマホは画面に合わせて拡縮、PCは等倍表示）
// 上下左右の中央寄せは、ステージ（#game-stage = 表示領域全体）に対して
// Phaser の Scale Manager（autoCenter）が行う。PCの等倍表示（NONE）でも autoCenter は有効。
const userAgent = navigator.userAgent.toLowerCase();
const isMobile = userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('android') !== -1;

new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game-stage',
  width: BOMB_GAME_WIDTH,
  height: BOMB_GAME_HEIGHT,
  transparent: true,
  scale: {
    mode: isMobile ? Phaser.Scale.FIT : Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
});
