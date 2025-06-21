# T-1グランプリ Node.js express x Vue.js
このリポジトリは、Node.js express x Vue.jsのリポジトリです

## 使い方
### 事前準備
- docker
- docker compose v2

### 開始方法

``` bash
docker compose up -d
```

上記で環境が全て起動します。※ちょっとだけ時間がかかります

- 画面: [http://localhost:5173/](http://localhost:5173/)
- API: [http://localhost:15001/](http://localhost:15001/)


### もしマイグレーションが走らなかった場合
もし、500エラーが出ていれば、マイグレーションを試してください
``` bsah
docker exec -it sns-app npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
```

### 停止
``` bash
docker compose down
```

もし、データをクリアしたい場合は、`-v`オプションをつけるとボリュームを削除します。

``` bash
docker compose down -v
```
## ディレクトリ構成
```
.
├── backend: バックエンドAPIのコードを格納したフォルダ。APIはこのフォルダを改修します
├── db: DBの設定ファイルなどを格納。特に変更することはありません
├── docker-compose.test.yml: GitHub Actionsで使うdocker composeファイル。
├── docker-compose.yml: 一連のコンテナを起動するファイル
├── docs: ドキュメント類
├── README.md: フロントのコードを格納したフォルダ。フロントはこのフォルダを改修します
├── readme.md: このファイル
└── sonar-project.properties: sonarqubeの設定ファイル。最初にprojectKeyを変更します
```

## 開発に際して
- 全てのソースを、コンテナにマウントしているため、ローカルの変更がコンテナにコピーされます。なので、ローカルでコードを変更すると即座に反映されます。
- コンテナ上で作成されたファイルは、root権限になっています。その後ローカルで編集する場合、`chown`などで変更してください


## テストについて
### テストを作成するときの注意事項
#### バックエンドAPI
- 必ず、`./backend/tests`配下に、`*.test.ts`の形式で作成してください
- `jest`でTypescriptで記載できるように設定してます。
- `./backend/.env.test`がtest用の設定ファイルです。必要なものがあれば追記してください
- DBは、テスト用のスキーマ`sns-app-test`を準備しています。DBはマイグレーション直後から始まる想定でテストを作ってください
- `jest`以外のテストライブラリを利用することも可能です。その場合、`package.json`を編集して、`npm run test`で動作するように設定してください。また、追加のライブラリを自由にインストールしてください
- `./backend/coverage/lcov.info`にカバレッジレポートを出力してください。（デフォルトで出力するはずです）

#### フロントのユニットテスト
- 必ず、`./front/tests`配下に、`*.spec.ts`の形式で作成してください。
- `vitest`でテストを動作させる想定です。
- テストは、必ず`npm run test`で実行できるようにしておいてください。
- `./front/coverage/lcov.info`にカバレッジレポートを出力してください。（デフォルトで出力するはずです）

### 実行
#### バックエンドAPI
- 全て実行
    ``` bash
    docker exec -it sns-app npm run test
    ```
- ファイル名を指定して実行
    ``` bash
    docker exec -it sns-app npm run test <ファイルの相対パス>
    ```

※ jestのオプションをつける

package.jsonを開いて下記を修正してください

``` json
"test": "jest --runInBand"
```

初期でついているrunInBandは、直列実行のオプションです。DBを使う場合に並列実行にすると、テスト間で干渉することがあります。

#### フロント
- 全て実行
    ``` bash
    docker exec -it sns-front npm run test:unit
    ```

    以降、`q`を押すまで、テストがホットリロードされます。修正したファイルに関係するテストが自動実行されるようになります。

    終了するときは、`q`かCtrl+Cを押してください

## Tips
### マイグレーション用ファイルの作成
事前にentityファイルを作成し、修正しておく

- entityファイル群とDBから差分migrationファイルを作成する
    ``` bash
    docker exec -it sns-app npx typeorm-ts-node-commonjs migration:generate ./src/migration/<テーブル名> -d ./src/data-source.ts
    ```

内容は問題ないので、そのままマイグレーションを実行する

- マイグレーションの実行
    ``` bsah
    docker exec -it sns-app npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
    ```

### ログの見方
アプリケーションが出力するログは、下記のコマンドでインタラクティブに表示されるので、動作中はずっと起動しておくとよい。
```
docker compose logs -f app
```
### DBを見る
```
mysql -u homepage -p --port 13306  --protocol tcp sns-api
パスワード:   ←　.env.developmentのMYSQL_PASSWORD
```

## ドキュメント
- [DB定義](./docs/database.md)
- [ログ設計](./docs/logs.md)

