# small-rest
JAX-RSみたいにrestでinterceptできたりするものが作ってみたくて勉強ついでに作ってみました。

## Description
Expressを使うのもたくさん見ましたがシンプルに標準機能だけで実装したくて自作しました。
一応HTTPとHTTPSが使えてhttp-methodに対応したmethodがあればそれを実行みたいにできるようにしたかったのでそうしてます。
minimum-rs-serverがこれの本体といえる部分でminimum-rs-sampleはサンプルみたいなものです。
動かすとHello Worldがレスポンスされます。（delete以外）
適当にしつらえた部分が非常に多いのでまともに動かない場所があると思いますｗ
まだオーバーヘッドがあったりするので無駄なところがあるかもしれませんが、node.jsで組んだのもこれが初めてなのでご容赦くだしあｗ

## Requirement
node-v10.13.0-win-x64を使用しています。

## Usage
vscodeに読ませてminimum-rs-serverをnpmでインストールしてminimum-rs-sampleのlaunch.jsonのnode.exeのパスを直して実行します。
SSLを使う場合は、証明書を作成の上でパスを書き換えて使用します。

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## Author

[wateratsea](https://github.com/wateratsea)
