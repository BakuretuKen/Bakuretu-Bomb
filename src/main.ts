import Phaser from 'phaser';
import { BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT } from './config';
import { GameScene } from './GameScene';

// スマホ判定（enchant.js 版と同じ判定。スマホは画面に合わせて拡縮、PCは等倍表示）
const userAgent = navigator.userAgent.toLowerCase();
const isMobile = userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('android') !== -1;

if (isMobile) {
  const stage = document.getElementById('game-stage');
  if (stage) {
    stage.style.width = '100vw';
    stage.style.height = '100vh';
  }
}

new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game-stage',
  width: BOMB_GAME_WIDTH,
  height: BOMB_GAME_HEIGHT,
  transparent: true,
  scale: isMobile
    ? { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
    : { mode: Phaser.Scale.NONE },
  scene: [GameScene],
});
