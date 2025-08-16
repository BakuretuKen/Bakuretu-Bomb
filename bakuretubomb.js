/**
 * 爆裂BOMB JavaScript版 ver1.04
 */

enchant();

var game = new Game(BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT); // game stage

if (window.Audio) {
    if (navigator.userAgent.indexOf('Trident/') > 0 || navigator.userAgent.indexOf('MSIE ') > 0) {
        var soundBomb1 = new Audio("bomb_sound.mp3");
        var soundBomb2 = new Audio("bomb_sound.mp3");
    } else {
        var soundBomb1 = new Audio("bomb_sound.wav");
        var soundBomb2 = new Audio("bomb_sound.wav");
    }
}
var soundCount = 0;
game.preload("bomb_icon_menu.png", "bomb_icon_bomb.png", "bomb_game_01.jpg", "bomb_game_02.jpg", "bomb_game_03.jpg");
game.fps = BOMB_GAME_FPS;

var imgFront = new Image();
var imgBack = new Image();
var imgEdge = new Image();

var spriteScreen  = new Sprite(BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);

var sf = new Surface(BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);
var sfBuff = new Surface(BOMB_GAME_WIDTH, BOMB_GAME_HEIGHT);

var scene1 = new Scene();

game.bomb = new Array(5);
game.mode = 0;
game.timeLine = 0;

game.timeLabel = new Label();
game.restart = new Sprite(256, 64);

window.onload = function()
{
    game.onload = function()
    {
    // === 初期化 ===
    
    imgFront = game.assets["bomb_game_01.jpg"]._element; // 初期画像
    imgBack = game.assets["bomb_game_02.jpg"]._element;; // 削除後画像
    imgEdge = game.assets["bomb_game_03.jpg"]._element;; // 淵画像
    
    sf.context.drawImage(imgFront, 0, 0);
    sfBuff.context.drawImage(imgEdge, 0, 0);
    spriteScreen.image = sf;
    
    spriteScreen.addEventListener('touchstart', function(e)
    {
        if (game.mode != 0) return;

        // ゲーム開始
        game.mode = 1;
        if (game.restart.frame == 0) game.restart.frame = 1;
        game.restart.x = 0;
        game.restart.y = 0;
        // Sprite削除
        scene1.removeChild(game.restart);
        // ゲーム初期化
        game.timeLine = 0;
        sf.context.drawImage(imgFront, 0, 0);
        sfBuff.context.drawImage(imgEdge, 0, 0);
        spriteScreen.image = sf;
        // Sprite表示
        game.createBoms();
        scene1.addChild(game.timeLabel);
    });
    
    game.createBoms = function()
    {
        for (var n = 0; n < 5; n++) {
            game.bomb[n] = new Sprite(64, 64);
            game.bomb[n].image = game.assets["bomb_icon_bomb.png"];
            
            game.bomb[n].init = function()
            {
                this.x = rand(BOMB_GAME_WIDTH - 128) + 64;
                this.y = -32;
                this.vy = rand(18)+6;
                this.baku = rand(BOMB_GAME_BAKURETU_BOMB_RATE);
                if (this.baku == 1) this.frame = 2; else this.frame = 0;
            };
            
            game.bomb[n].addEventListener("touchstart", function(e)
            {
                if (this.baku == 1) {
                    clearBlockBig(this.x + 32, this.y + 32);
                } else {
                    clearBlock(this.x + 32, this.y + 32);
                }
                
                this.init();
                if (BOMB_GAME_BAKURETU_BOMB_SOUND == "on") {
                    if (window.Audio) {
                        if (soundCount == 0) soundBomb1.play(); else soundBomb2.play();
                        soundCount = 1 - soundCount;
                    }
                }
            });
            
            game.bomb[n].addEventListener('enterframe', function()
            {
                if (this.baku == 1) {
                    this.frame = 3 + (2 - this.frame);
                } else {
                    this.frame = 1 - this.frame;
                }
                this.y += this.vy;
                if (this.y > BOMB_GAME_HEIGHT) this.init();
            });
            
            game.bomb[n].init();
            
            scene1.addChild(game.bomb[n]);
            
        } // for(n)
    };
    
    // --- 残りタイム ---
    game.timeLabel.x = 10;
    game.timeLabel.y = 5;
    game.timeLabel.color = BOMB_GAME_TIMER_LABEL_COLOR;
    game.timeLabel.font  = "32px 'Consolas', 'Monaco'";
    game.timeLabel.addEventListener('enterframe', function()
    {
        var progress = parseInt(game.timeLine/game.fps);
        time = BOMB_GAME_LIMIT_TIME - parseInt(game.timeLine/game.fps)+"";
        if (time <= 0) {
            // ゲーム終了（Sprite削除）
            game.mode = 2;
            scene1.removeChild(game.timeLabel);
            for (var n = 0; n < 5; n++) scene1.removeChild(game.bomb[n]);
            // Sprite表示
            scene1.addChild(game.restart);
        }
        this.text = "" + time;
        game.timeLine++;
    });
    
    // --- ゲームスタート・リスタート ボタン ---
    game.restart.image = game.assets["bomb_icon_menu.png"];
    game.restart.x = (BOMB_GAME_WIDTH/2) - (game.restart.width/2);
    game.restart.y = (BOMB_GAME_HEIGHT/2) - (game.restart.height/2);
    game.restart.addEventListener("touchend", function(e)
    {
        // ゲーム開始・再開
        if (game.mode == 1) return;
        game.mode = 1;
        if (game.restart.frame == 0) game.restart.frame = 1;
        game.restart.x = 0;
        game.restart.y = 0;
        // Sprite削除
        scene1.removeChild(game.restart);
        // ゲーム初期化
        game.timeLine = 0;
        sf.context.drawImage(imgFront, 0, 0);
        sfBuff.context.drawImage(imgEdge, 0, 0);
        spriteScreen.image = sf;
        // Sprite表示
        game.createBoms();
        scene1.addChild(game.timeLabel);
    });
    
    // === シーン1 初回実行 ===
    
    scene1.addChild(spriteScreen);
    
    scene1.addChild(game.restart);
    
    game.replaceScene(scene1); // ゲームスタート
    
    
    }; // End of game.onload
    
    game.start();
};

function rand(num)
{
    return Math.floor(Math.random()*num);
};

function clearBlockBig(x, y)
{
    clearBlock(x, y);
    clearBlock(x-30, y);
    clearBlock(x+30, y);
    clearBlock(x, y-30);
    clearBlock(x, y+30);
    clearBlock(x-20, y-20);
    clearBlock(x+20, y-20);
    clearBlock(x-20, y+20);
    clearBlock(x+20, y+20);
};

function clearBlock(x, y)
{
    // Set Back Image on Paper Image
    sfBuff.context.drawImage(imgBack, x-24, y-8, 48, 16, x-24, y-8, 48, 16);
    sfBuff.context.drawImage(imgBack, x-20, y-12, 40, 24, x-20, y-12, 40, 24);
    sfBuff.context.drawImage(imgBack, x-8, y-24, 16, 48, x-8, y-24, 16, 48);
    sfBuff.context.drawImage(imgBack, x-12, y-20, 24, 40, x-12, y-20, 24, 40);
    sfBuff.context.drawImage(imgBack, x-16, y-16, 32, 32, x-16, y-16, 32, 32);
    
    // Set Buff Image on Main Context
    sf.context.drawImage(sfBuff._element, x-24-4, y-8-4, 48+8, 16+8, x-24-4, y-8-4, 48+8, 16+8);
    sf.context.drawImage(sfBuff._element, x-20-4, y-12-4, 40+8, 24+8, x-20-4, y-12-4, 40+8, 24+8);
    sf.context.drawImage(sfBuff._element, x-8-4, y-24-4, 16+8, 48+8, x-8-4, y-24-4, 16+8, 48+8);
    sf.context.drawImage(sfBuff._element, x-12-4, y-20-4, 24+8, 40+8, x-12-4, y-20-4, 24+8, 40+8);
    sf.context.drawImage(sfBuff._element, x-16-4, y-16-4, 32+8, 32+8, x-16-4, y-16-4, 32+8, 32+8);
};

