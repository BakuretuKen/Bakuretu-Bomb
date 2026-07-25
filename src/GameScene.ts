/**
 * 爆裂BOMB TypeScript版 ver3.00
 * enchant.js 版 ver2.01 を Phaser 3 に移植（ゲーム内容・挙動は同一）
 */
import Phaser from 'phaser';
import {
  BOMB_GAME_WIDTH,
  BOMB_GAME_HEIGHT,
  BOMB_GAME_BAKURETU_BOMB_RATE,
  BOMB_GAME_FPS,
  BOMB_GAME_ANIME_IMAGE,
  BOMB_GAME_ANIME_WAIT,
  BOMB_GAME_ANIME_FRAME,
  BOMB_GAME_ANIME_POSITION_X,
  BOMB_GAME_ANIME_POSITION_Y,
} from './config';

const BOMB_COUNT = 5; // 落下ボムの数

function rand(num: number): number {
  return Math.floor(Math.random() * num);
}

// --- 落下ボム Sprite
class BombSprite extends Phaser.GameObjects.Sprite {
  vy = 0;
  baku = 0;
  frameIndex = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'bomb', 0);
    this.setOrigin(0, 0);
  }

  init(): void {
    this.x = rand(BOMB_GAME_WIDTH - 50 + 15) - 15;
    this.y = -32;
    this.vy = rand(18) + 6;
    this.baku = rand(BOMB_GAME_BAKURETU_BOMB_RATE);
    this.frameIndex = this.baku === 1 ? 2 : 0;
    this.setFrame(this.frameIndex);
  }

  enterframe(isPause: boolean): void {
    if (isPause) return;

    if (this.baku === 1) {
      this.frameIndex = 3 + (2 - this.frameIndex);
    } else {
      this.frameIndex = 1 - this.frameIndex;
    }
    this.setFrame(this.frameIndex);
    this.y += this.vy;
    if (this.y > BOMB_GAME_HEIGHT) this.init();
  }
}

// --- アニメーション Sprite
class AnimeSprite extends Phaser.GameObjects.Sprite {
  time2 = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'anime', 'anime-0');
    this.setOrigin(0, 0);
    this.init();
  }

  init(): void {
    this.setFrame('anime-0');
    this.x = BOMB_GAME_ANIME_POSITION_X;
    this.y = -BOMB_GAME_HEIGHT; // 非表示
    this.time2 = 0;
  }

  onenterframe(): void {
    this.time2++;
    if (this.time2 < BOMB_GAME_ANIME_WAIT) {
      return;
    }

    this.y = BOMB_GAME_ANIME_POSITION_Y; // 表示
    for (let i = 0; i < BOMB_GAME_ANIME_IMAGE; i++) {
      if (this.time2 === BOMB_GAME_ANIME_WAIT + (i * BOMB_GAME_ANIME_FRAME)) {
        this.setFrame(`anime-${i}`);
      }
    }
    if (this.time2 >= BOMB_GAME_ANIME_WAIT + (BOMB_GAME_ANIME_IMAGE * BOMB_GAME_ANIME_FRAME)) {
      this.time2 = 0;
      this.y = -BOMB_GAME_HEIGHT; // 非表示
    }
  }
}

export class GameScene extends Phaser.Scene {
  private mode = 0;
  private isSound = false;
  private isPause = false;
  private bomb: BombSprite[] = [];

  private sf!: Phaser.Textures.CanvasTexture; // メイン画面 Surface 相当
  private sfBuff!: HTMLCanvasElement; // バッファ Surface 相当
  private sfBuffContext!: CanvasRenderingContext2D;

  private imgFront!: HTMLImageElement; // 初期画像
  private imgBack!: HTMLImageElement; // 削除後画像
  private imgEdge!: HTMLImageElement; // 淵画像

  private spriteScreen!: Phaser.GameObjects.Image;
  private restart!: Phaser.GameObjects.Sprite;
  private animeSprite: AnimeSprite | null = null;
  private pauseSprite!: Phaser.GameObjects.Sprite;
  private soundSprite!: Phaser.GameObjects.Sprite;

  private soundBomb1: HTMLAudioElement | null = null;
  private soundBomb2: HTMLAudioElement | null = null;
  private soundCount = 0;

  constructor() {
    super('game');
  }

  preload(): void {
    this.load.spritesheet('menu', 'bomb_icon_menu.png', { frameWidth: 256, frameHeight: 64 });
    this.load.spritesheet('bomb', 'bomb_icon_bomb.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('front', 'bomb_game_01.jpg');
    this.load.image('back', 'bomb_game_02.jpg');
    this.load.image('edge', 'bomb_game_03.jpg');
    this.load.spritesheet('pause', 'bomb_icon_pause.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('sound', 'bomb_icon_sound.png', { frameWidth: 61, frameHeight: 48 });
    if (BOMB_GAME_ANIME_IMAGE > 0) {
      this.load.image('anime', 'bomb_game_anime.jpg');
    }
  }

  create(): void {
    // === 初期化 ===
    if (window.Audio) {
      if (navigator.userAgent.indexOf('Trident/') > 0 || navigator.userAgent.indexOf('MSIE ') > 0) {
        this.soundBomb1 = new Audio('bomb_sound.mp3');
        this.soundBomb2 = new Audio('bomb_sound.mp3');
      } else {
        this.soundBomb1 = new Audio('bomb_sound.wav');
        this.soundBomb2 = new Audio('bomb_sound.wav');
      }
    }

    this.imgFront = this.textures.get('front').getSourceImage() as HTMLImageElement; // 初期画像
    this.imgBack = this.textures.get('back').getSourceImage() as HTMLImageElement; // 削除後画像
    this.imgEdge = this.textures.get('edge').getSourceImage() as HTMLImageElement; // 淵画像

    const sf = this.textures.createCanvas('screen', BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);
    if (!sf) {
      throw new Error('画面用 CanvasTexture の作成に失敗しました');
    }
    this.sf = sf;
    this.sfBuff = document.createElement('canvas');
    this.sfBuff.width = BOMB_GAME_WIDTH;
    this.sfBuff.height = BOMB_GAME_HEIGHT;
    const sfBuffContext = this.sfBuff.getContext('2d');
    if (!sfBuffContext) {
      throw new Error('バッファ canvas の 2D コンテキスト取得に失敗しました');
    }
    this.sfBuffContext = sfBuffContext;

    this.sf.context.drawImage(this.imgFront, 0, 0, BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);
    this.sfBuffContext.drawImage(this.imgEdge, 0, 0, BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);
    this.sf.refresh();

    // === シーン構築（enchant.js 版と同じ重ね順で追加）===
    this.spriteScreen = this.add.image(0, 0, 'screen').setOrigin(0, 0);

    // アニメーション Sprite の初期化（スタート画面から表示）
    if (BOMB_GAME_ANIME_IMAGE > 0) {
      const animeTexture = this.textures.get('anime');
      const animeImg = animeTexture.getSourceImage() as HTMLImageElement;
      const frameHeight = animeImg.height / BOMB_GAME_ANIME_IMAGE;
      for (let i = 0; i < BOMB_GAME_ANIME_IMAGE; i++) {
        animeTexture.add(`anime-${i}`, 0, 0, i * frameHeight, animeImg.width, frameHeight);
      }
      this.animeSprite = new AnimeSprite(this);
      this.add.existing(this.animeSprite);
    }

    // --- ゲームスタート・リスタート ボタン ---
    this.restart = this.add
      .sprite((BOMB_GAME_WIDTH / 2) - 128, (BOMB_GAME_HEIGHT / 2) - 32, 'menu', 0)
      .setOrigin(0, 0)
      .setInteractive();

    // ポーズボタンの初期化
    this.pauseSprite = this.add
      .sprite(5, BOMB_GAME_HEIGHT - 53, 'pause', this.isPause ? 1 : 0)
      .setOrigin(0, 0)
      .setVisible(false)
      .setInteractive();
    this.pauseSprite.on('pointerdown', () => {
      this.isPause = !this.isPause;
      this.pauseSprite.setFrame(this.isPause ? 1 : 0);
      for (const bomb of this.bomb) {
        bomb.setVisible(this.isPause ? false : true);
      }
    });

    // サウンドボタンの初期化
    this.soundSprite = this.add
      .sprite(BOMB_GAME_WIDTH - 64, BOMB_GAME_HEIGHT - 52, 'sound', this.isSound ? 1 : 0)
      .setOrigin(0, 0)
      .setInteractive();
    this.soundSprite.on('pointerdown', () => {
      this.isSound = !this.isSound;
      this.soundSprite.setFrame(this.isSound ? 1 : 0);
    });

    // 全画面クリック（PC）
    this.spriteScreen.setInteractive();
    this.spriteScreen.on('pointerdown', () => {
      if (this.mode !== 0) return;
      this.startGame();
    });

    // STARTボタンクリック（スマホ）
    this.restart.on('pointerup', () => {
      // ゲーム開始・再開
      if (this.mode === 1) return;
      this.startGame();
    });

    // enterframe 相当（enchant.js の game.fps と同じ周期でゲームロジックを進める）
    this.time.addEvent({
      delay: 1000 / BOMB_GAME_FPS,
      loop: true,
      callback: () => this.enterframe(),
    });
  }

  // ゲーム開始
  private startGame(): void {
    this.mode = 1;
    // メニュー画像に2フレーム目がある場合のみ切り替え（enchant.js 版の frame = 1 相当）
    if (this.textures.get('menu').frameTotal > 2) {
      this.restart.setFrame(1);
    }
    this.restart.setVisible(false); // scene1.removeChild(game.restart) 相当
    this.restart.disableInteractive();
    // ゲーム初期化
    this.sf.context.drawImage(this.imgFront, 0, 0, BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);
    this.sfBuffContext.drawImage(this.imgEdge, 0, 0, BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);
    this.sf.refresh();
    // 爆弾表示
    this.createBoms();
    // PauseSprite表示
    this.pauseSprite.setVisible(true);
  }

  private createBoms(): void {
    for (let n = 0; n < BOMB_COUNT; n++) {
      const bomb = new BombSprite(this);
      this.bomb[n] = bomb;

      bomb.setInteractive();
      bomb.on('pointerdown', () => {
        if (bomb.baku === 1) {
          this.clearBlockBig(bomb.x + 32, bomb.y + 32);
        } else {
          this.clearBlock(bomb.x + 32, bomb.y + 32);
        }

        bomb.init();
        if (this.isSound === true) {
          if (this.soundBomb1 && this.soundBomb2) {
            if (this.soundCount === 0) void this.soundBomb1.play(); else void this.soundBomb2.play();
            this.soundCount = 1 - this.soundCount;
          }
        }
      });

      bomb.init();

      this.add.existing(bomb); // 最後に追加され、ボタン類より前面に表示（enchant.js 版と同じ）
    } // for(n)
  }

  private enterframe(): void {
    if (this.animeSprite) {
      this.animeSprite.onenterframe();
    }
    for (const bomb of this.bomb) {
      bomb.enterframe(this.isPause);
    }
  }

  private clearBlockBig(x: number, y: number): void {
    this.clearBlock(x, y);
    this.clearBlock(x - 30, y);
    this.clearBlock(x + 30, y);
    this.clearBlock(x, y - 30);
    this.clearBlock(x, y + 30);
    this.clearBlock(x - 20, y - 20);
    this.clearBlock(x + 20, y - 20);
    this.clearBlock(x - 20, y + 20);
    this.clearBlock(x + 20, y + 20);
  }

  private clearBlock(x: number, y: number): void {
    // Set Back Image on Paper Image
    const buff = this.sfBuffContext;
    buff.drawImage(this.imgBack, x - 24, y - 8, 48, 16, x - 24, y - 8, 48, 16);
    buff.drawImage(this.imgBack, x - 20, y - 12, 40, 24, x - 20, y - 12, 40, 24);
    buff.drawImage(this.imgBack, x - 8, y - 24, 16, 48, x - 8, y - 24, 16, 48);
    buff.drawImage(this.imgBack, x - 12, y - 20, 24, 40, x - 12, y - 20, 24, 40);
    buff.drawImage(this.imgBack, x - 16, y - 16, 32, 32, x - 16, y - 16, 32, 32);

    // Set Buff Image on Main Context
    const ctx = this.sf.context;
    ctx.drawImage(this.sfBuff, x - 24 - 4, y - 8 - 4, 48 + 8, 16 + 8, x - 24 - 4, y - 8 - 4, 48 + 8, 16 + 8);
    ctx.drawImage(this.sfBuff, x - 20 - 4, y - 12 - 4, 40 + 8, 24 + 8, x - 20 - 4, y - 12 - 4, 40 + 8, 24 + 8);
    ctx.drawImage(this.sfBuff, x - 8 - 4, y - 24 - 4, 16 + 8, 48 + 8, x - 8 - 4, y - 24 - 4, 16 + 8, 48 + 8);
    ctx.drawImage(this.sfBuff, x - 12 - 4, y - 20 - 4, 24 + 8, 40 + 8, x - 12 - 4, y - 20 - 4, 24 + 8, 40 + 8);
    ctx.drawImage(this.sfBuff, x - 16 - 4, y - 16 - 4, 32 + 8, 32 + 8, x - 16 - 4, y - 16 - 4, 32 + 8, 32 + 8);

    this.sf.refresh();
  }
}
