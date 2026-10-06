# SQL実践入門ドリル

『［改訂新版］SQL実践入門』の章ごとの演習ドリルです。1問ずつスライドで出題し、選択肢を選ぶと、そのSQLの実行計画と結果を表示します。実行計画は、本書のサンプルデータを使ってPostgreSQL 16とMySQL 8.0で実際に取得したものです。

公開ページ：https://nakayoshi-book-club.github.io/sql-practical/

問題の誤りの指摘や改善、新しい章の追加は、プルリクエストで受け付けています。mainブランチにマージされると、GitHub Actionsがページを作り直して公開します。

## ディレクトリ構成

| パス | 内容 |
|---|---|
| `src/index.html` | 章の一覧ページ |
| `src/engine.html` | 全章で共通の画面と動作 |
| `src/chapters/chNN.js` | 章ごとの問題、基礎スライド、サンプルデータの表 |
| `src/data/chNN.json` | 選択肢のSQLの実行計画と結果 |
| `sql/chNN/` | サンプルテーブルを作るSQLと、選択肢のSQL |
| `tools/collect.py` | `sql/chNN/` から `src/data/chNN.json` を作る |
| `tools/build.py` | `src/` から公開用の `dist/` を作る |
| `tools/check.js` | `dist/` の全スライドを描画し、参照の誤りを調べる |

`src/data/` は `tools/collect.py` が生成するファイルです。手で編集しないでください。

## 問題文や解説を直す

問題文、選択肢、解説は `src/chapters/chNN.js` の `SLIDES` にあります。1問は次の形で書きます。

```js
{
  type: "q", sec: "3.1 UNIONを使った冗長な表現", title: "税抜と税込を年で切り替える",
  table: ["items"], ref: "branch",
  prompt: "問題文",
  choices: [
    { q: "items_union_all", tag: "UNION ALL", ok: false, note: "この選択肢の解説" },
    { q: "items_case", tag: "CASE 式", ok: true, note: "正解の解説" },
  ],
  takeaway: "回答後に表示するまとめ。<b>強調したい一文</b>",
},
```

| キー | 意味 |
|---|---|
| `q` | 選択肢のSQL。`sql/chNN/q/` のファイル名（拡張子なし）を書く |
| `text` | SQLを伴わない選択肢の文 |
| `ok` | 正解なら `true`。1問に1つだけ |
| `show` | `text` の選択肢のときに、実行計画を見せるSQLの一覧 |
| `table` | データタブに表示する表。`T` に定義した名前を書く |
| `ref` | 関連する基礎スライドの `id` |
| `db` | 最初に表示するDB。`"my"` でMySQL。省略するとPostgreSQL |

直したら、手元で次を実行して確認します。必要なのはPythonとNode.jsだけです。

```sh
python3 tools/build.py
node tools/check.js
open dist/ch03/index.html
```

## SQLを追加する・実行計画を取り直す

選択肢に新しいSQLを使うときは、`sql/chNN/q/` にSQLファイルを置き、実行計画を取り直します。PostgreSQLとMySQLのコンテナはDockerで起動します。

```sh
docker run -d --rm --name sqlquiz-pg -e POSTGRES_PASSWORD=quiz postgres:16
docker run -d --rm --name sqlquiz-my -e MYSQL_ROOT_PASSWORD=quiz mysql:8.0
python3 tools/collect.py ch03
```

`tools/collect.py` は、章と同じ名前のデータベースを作り直してから、次の順に実行します。

1. `sql/chNN/setup.sql`（両方のDB）、`setup_pg.sql`（PostgreSQLだけ）、`setup_my.sql`（MySQLだけ）でサンプルテーブルを作る。
2. `sql/chNN/q/*.sql` の実行計画を取る。PostgreSQLは `EXPLAIN (ANALYZE, BUFFERS)`、MySQLは `EXPLAIN ANALYZE` を使う。
3. PostgreSQLで各SQLの結果を取る。

SQLの前に画面には出さない文を実行したいときは、同じ名前で `.pre.sql`（両方）、`.pre_pg.sql`、`.pre_my.sql` のファイルを置きます。例：`sort_16mb.pre_pg.sql` に `SET work_mem = '16MB';` を書く。

章ごとの特別な処理は `sql/chNN/collect.json` に書きます。

| キー | 処理 |
|---|---|
| `myres` | MySQLの結果も取るSQLの一覧 |
| `res` | 結果の代わりに表示する文 |
| `resg` | 指定した行を追加した状態の結果も取る（第3章の演習問題） |
| `cache` | PostgreSQLを再起動したあと、同じSQLを2回実行する（第1章） |

取り直した `src/data/chNN.json` も、プルリクエストに含めてください。

## 章を追加する

1. `src/chapters/` に既存の章をコピーして `chNN.js` を作り、`T`、`SLIDES`、`INTRO_BODY`、`CH` を書き換える。`CH.store` は回答の保存先の名前なので、ほかの章と重ならない値を付ける。
2. `sql/chNN/` にサンプルテーブルのSQLと選択肢のSQLを置き、`tools/collect.py chNN` を実行する。
3. `src/index.html` の一覧に章へのリンクを追加する。

## 文章の書き方

- 本書の内容は要約して書き、本文を書き写さない。サンプルデータは本書の表を使う。
- 実行計画や結果について書く数値は、`src/data/` の値と一致させる。本書と実際の計画が違うときは、その違いを書く。
- 和文と英数字のあいだに空白を入れない。
