# 爆裂BOMB (Bakuretu BOMB)

[![タイトル画像](img/title.jpg)](https://bakuretuken.github.io/bakuretu-bomb/)

落下するボムをクリックして画像の一部を消去するJavaScriptブラウザゲームです。enchant.jsフレームワークを使用したゲームです。

昔流行った「妄撮」をゲーム化できないか考えて作りました。

**↓画像クリックでゲーム開始**

[![ゲーム開始画像](img/game01.jpg)](https://bakuretuken.github.io/bakuretu-bomb/)

## 概要

爆裂BOMBは、HTML5 Canvasとenchant.jsを使用したシンプルなブラウザゲームです。

落下するボムをクリックまたはタッチして、背景画像の一部を消去していきます。<br />
特殊な「爆裂ボム」も登場し、より大きな範囲を消去できます。

## 主な特徴

- PCとスマートフォンに対応
- より大きな範囲を消去する特殊な「爆裂」ボム
- 画像を差し替えるだけで簡単にカスタマイズ可能
- MITライセンスで自由に利用・改造OK

## ゲームメカニクス

- 落下するボムをクリックまたはタッチして背景画像の一部を消去
- 特定の割合で特殊な「爆裂」ボムが出現し、より大きな範囲を消去
- ブロックを消去すると下に隠れた画像が現れる

## サンプル
- [公式サンプル・解説ページ](https://bakuretuken.com/bomb/)

## インストール

1. 本リポジトリをクローンまたはダウンロード

2. ローカル環境でWEBサーバ起動（ファイルをWebサーバーにアップロード）

3. ブラウザで以下のファイルを開く
   - `index.html`
   - `index_noanime.html` - アニメーションなしHTML

## 使用方法

1. ゲーム開始後、画面上部から落下するボムが表示されます
2. ボムをクリックまたはタッチして消去します
3. 特殊な「爆裂」ボムが出現したら、より大きな範囲を消去できます
4. 画像を削るだけのツールなので、クリアはありません

## カスタマイズ

### ゲーム設定

`index.html`ファイル内の以下の変数を変更してゲームをカスタマイズできます：

```javascript
// キャンバスサイズ
var BOMB_GAME_WIDTH  = 540;
var BOMB_GAME_HEIGHT = 800;
// フレームレート
var BOMB_GAME_FPS = 12;
// 爆裂ボムの出現頻度
var BOMB_GAME_BAKURETU_BOMB_RATE = 20;
```

### 画像カスタマイズ

以下の画像ファイルを置き換えることで、ゲーム画像を変更できます。

- `bomb_game_01.jpg` - ゲーム初期画像
- `bomb_game_02.jpg` - ボム破壊後画像
- `bomb_game_03.jpg` - ボム破壊時の縁画像

## ファイル構成

```
bomb_js/
├── index.html              # ゲームHTML
├── index_noanime.html      # ゲームHTML（アニメーションなし）
├── bakuretubomb201.js      # ゲームプログラム本体
├── enchant.min.js          # enchant.jsゲームフレームワーク
├── bomb_sound.mp3          # 音声ファイル
├── bomb_sound.wav          # 音声ファイル
├── bomb_game_01.jpg        # ゲーム初期画像
├── bomb_game_02.jpg        # ボム破壊後画像
├── bomb_game_03.jpg        # ボム破壊時のフチ画像
├── bomb_icon_bomb.png      # ボムアイコン画像
├── bomb_icon_menu.png      # メニュー文字画像
├── bomb_icon_pause.png     # ポーズアイコン画像
├── bomb_icon_sound.png     # サウンドアイコン画像
└── README.md               # このファイル
```

### ゲームの改造

`index.html`の読み込みJS `bakuretubomb201.js` を改造して使用してください。

```
<script src="bakuretubomb201.js"></script>
```

`enchant.js`というゲームエンジンを使用しています。

手元のPCでWEBサーバを立ち上げるなどして、サーバ経由で動作確認を行ってください。<br />
ローカルでWEBサーバ起動可能な開発プログラム言語もあります。

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server -p 8000

# PHPの場合
php -S localhost:8000
```

## [オプション] アニメーション機能

`index.html` は「アニメーション機能を使用したHTML」です。<br />

アニメーション機能を使用する場合は、HTMLファイル内の以下の変数を追加してください。

```js
・・・省略・・・
var BOMB_GAME_ANIME_IMAGE = 3; // アニメーション画像枚数（アニメ機能利用）
var BOMB_GAME_ANIME_POSITION_X = 196; // アニメーション画像X位置
var BOMB_GAME_ANIME_POSITION_Y = 118; // アニメーション画像Y位置
var BOMB_GAME_ANIME_FRAME = 1; // アニメーション画像切り替えフレーム数
var BOMB_GAME_ANIME_WAIT = 40; // アニメーション待ちフレーム数
```

`BOMB_GAME_ANIME_IMAGE` で「アニメーション画像枚数」を設定することでアニメーション機能を使用できます。<br />

```js
var BLOCK_GAME_ANIME_IMAGE = 3;
```

「bomb_game_anime.jpg」画像を用意してください。<br />
画像は「アニメーション画像枚数」分の画像を縦に並べてください。<br />
画像はJPEGフォーマットで用意してください。（縦横の画像サイズは8の倍数を推奨）

**bomb_game_anime.jpg**

![アニメーション画像](img/bomb_game_anime.jpg)

アニメーション画像の表示位置を下記で設定します。

```js
var BOMB_GAME_ANIME_POSITION_X = 172; // アニメーション画像X位置
var BOMB_GAME_ANIME_POSITION_Y = 59;  // アニメーション画像Y位置
```

`BOMB_GAME_ANIME_FRAME` で「アニメーションフレーム間隔」を設定することでアニメーション速度を調整できます（フレーム設定）<br />
設定数が大きいほどアニメーション速度が早くなります。

`BOMB_GAME_ANIME_WAIT` で「アニメーション待ち時間」を設定することでアニメーションの待ち時間を調整できます（フレーム設定）<br />
待ち時間が大きいほどアニメーションとアニメーションの間隔が長くなります。

上記の設定だと、40フレーム経つと3枚のアニメーション画像が1フレーム間隔で表示されます。そして、また40フレームの待ちに入ります。<br />
表示座標位置は (172, 59) です。

【特記事項】<br />
正しい大きさでアニメ画像を作っても表示画像サイズがズレて表示されてしまう場合は、JPEG の DPI の問題の可能性が高いです。すべての JPEG画像の DPI を 72 に設定してください。

## 注意事項

- 画像を更新したのに反映されない場合は、ブラウザのキャッシュをクリアしてください
   - SHIFT + Ctrl + R (Windows)
   - Shift + Command + R (Mac)
- WEBサーバ経由で表示させた場合、サーバ設定によってはコマンドでブラウザキャッシュがクリアされない場合があります。
   - ブラウザ設定から該当ドメインのキャッシュクリアを行ってください

## ライセンス

- 本ゲームプログラム・画像はMITライセンスです。自由にご利用ください
- 使用しているゲームエンジン [enchant.js](https://github.com/wise9/enchant.js/) もMITライセンスです

---

bakuretuKen 2013-2026<br />
@see https://bakuretuken.com/bomb/
