#web-click-counter

クリックしたら音が流れてカウントが1増えるだけのやつです。  
[へぇボタン](http://tech.speee.jp/entry/2581)や[にゃんぱすーボタン](http://nyanpass.com)を参考にして作りました。

## Required

とりあえず以下の環境で動作確認をしています。

- Node.js(>8.6.0)
- node-gyp(>3.6.2)

## Usage

```
# まずは必要なものを入れる
git clone https://github.com/wd-shiroma/web-click-counter.git
cd web-click-counter
sudo npm install -g node-gyp
npm install

# 設定ファイルの初期設定を行う
cp config/default.yaml.sample config/default.yaml
vim config/default.yaml

# DB初期化
npm run-script init

# アプリケーション起動
npm start

# デバッグモードで起動したい場合は以下を入力
DEBUG=web-click-counter:* npm start
# 
```

Web用で3000番ポート、WebSocket用で4000番ポートが待ち受け状態になります。

## Configuration

- とりあえず`system.domain`だけは直しておいてください。

- buttonsは複数用意することができます。

- ボタンごとのsoundsも複数用意することができます。

## Sharing message

共有ボタンの文面を状況によって修正したい場合は、変数を用いることができます。

```
template text variables:
  {title}                system.title
  {url}                  location.href
  {button_title}         buttons.title
  {button_count}        (button counter)
  {all_count}           (total all counter)
  {user_button_count}   (user counter)
  {user_all_count}      (all count per user)
```

## License

AGPL3.0に準拠して利用・配布してください。
