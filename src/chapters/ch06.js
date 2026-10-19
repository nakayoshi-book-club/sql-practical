const T = {
  employees: { name: "Employees（社員）", cols: ["emp_id", "emp_name", "dept_id"], rows: [
    ["001","石田","10"],["002","小笠原","11"],["003","夏目","11"],["004","米田","12"],["005","釜本","12"],["006","岩瀬","12"]] },
  departments: { name: "Departments（部署）", cols: ["dept_id", "dept_name"], rows: [
    ["10","総務"],["11","人事"],["12","開発"],["13","営業"]] },
  digits: { name: "Digits（数字）", cols: ["digit"], rows: [[0],[1],[2],[3],[4],[5],[6],[7],[8],[9]] },
  shops: { name: "Shops（店舗）", cols: ["shop_id", "shop_name", "area"], rows: [
    ["00001","店舗00001","東京都"],["00002","店舗00002","大阪府"],["00003","店舗00003","北海道"],["00004","店舗00004","青森県"],["00005","店舗00005","岩手県"],
    ["00006","店舗00006","宮城県"],["00007","店舗00007","秋田県"],["00008","店舗00008","山形県"],["00009","店舗00009","福島県"],["00010","店舗00010","福岡県"]] },
  orders: { name: "Orders（注文）", cols: ["order_id", "shop_id", "order_date", "amount"], rows: [
    [1,"00001","2024-01-01",200],[2,"00001","2024-01-02",300],[3,"00001","2024-01-03",400],[50000,"00001","2024-08-11",100],
    [50001,"00002","2024-08-12",200],[50002,"00002","2024-08-13",300],[51022,"00003","2024-05-27",2300],[51023,"00003","2024-05-28",2400],
    [99999,"00050","2024-03-21",5000],[100000,"00050","2024-03-22",100]] },
  table_a: { name: "Table_A", cols: ["col_a"], rows: [[1],[2],[3],[4],[5]] },
  table_b: { name: "Table_B", cols: ["col_b"], rows: [[1],[2],[3]] },
  table_c: { name: "Table_C", cols: ["col_c"], rows: [[2],[3],[4]] },
};

const TRI_NOTE = "Table_Aは先頭の5行だけを表示しています。Table_Aは1〜1000の1,000行、Table_BとTable_Cは3行ずつです。";
const SHOPS_NOTE = "Shopsは50行（areaは10都道府県に5店舗ずつ）、Ordersは100,000行で、どちらも一部の行だけを表示しています。Ordersは店舗00001が50,000件、残りの49店舗が約1,021件ずつ持ち、shop_idの順に格納されています。インデックスは主キーのほかに、Orders.shop_idのidx_orders_shopがあります。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "kind", title: "結合の種類と結果の行数" },
  { type: "intro", id: "algo", title: "3つの結合アルゴリズム" },
  { type: "intro", id: "plan", title: "結合の実行計画の読み方" },
  {
    type: "q", sec: "6.1 機能から見た結合の種類", title: "クロス結合の行数", ref: "kind", table: ["employees", "departments"],
    prompt: "6行のEmployeesと4行のDepartmentsをクロス結合する。結果は何行？",
    choices: [
      { text: "4行", ok: false, note: "部署の数です。クロス結合は行を絞りません。" },
      { text: "6行", ok: false, note: "社員の数です。結合条件のある内部結合なら6行になります。" },
      { text: "10行", ok: false, note: "足し算ではなく掛け算です。" },
      { text: "24行", ok: true, note: "6×4=24行です。社員1行に対して部署4行がすべて組み合わさります。PostgreSQLの実行計画は、結合条件のないNested Loopです。MySQLは「Inner hash join (no condition)」と、条件なしのハッシュ結合で表示します。" },
    ],
    show: [{ q: "cross_join", tag: "CROSS JOIN" }],
    takeaway: "<b>クロス結合は2つのテーブルの行のすべての組み合わせを返す。</b>結果の行数は行数の掛け算で、結合の中で最もコストが高い演算です。内部結合と外部結合は、このクロス結合を基準に考えます。",
  },
  {
    type: "q", sec: "6.1 機能から見た結合の種類", title: "うっかりクロス結合を防ぐ構文", ref: "kind", table: ["employees", "departments"],
    prompt: "結合条件を書き忘れたとき、PostgreSQLが構文エラーで止めてくれる書き方はどれ？",
    choices: [
      { q: "cross_comma", tag: "FROMにカンマで並べる", ok: false, note: "古い構文です。結合条件がなくてもエラーにならず、クロス結合として24行を返します。本書が「うっかりクロス結合」と呼ぶパターンです。" },
      { q: "inner_noon", tag: "INNER JOIN（ONなし）", ok: true, note: "PostgreSQLでは、ONのないINNER JOINは構文エラーです。ただしMySQL 8.0はエラーにせず、クロス結合として24行を返しました（結果タブのMySQLの結果）。本書の「標準SQLの構文ならエラーになる」は、MySQLには当てはまりません。" },
      { text: "どちらの書き方でも、結合条件がなければ構文エラーになる", ok: false, note: "カンマで並べる古い構文は、結合条件がなくてもエラーになりません。" },
    ],
    takeaway: "<b>結合は標準SQLのJOIN構文で書き、結合条件はONに書く。</b>3つ以上のテーブルを結合すると条件の書き漏れが起きやすくなります。構文で防げるかはDBMS次第なので、MySQLでは特に注意が必要です。",
  },
  {
    type: "q", sec: "6.1 機能から見た結合の種類", title: "内部結合を相関サブクエリで書き換えると", ref: "plan", table: ["employees", "departments"],
    prompt: "社員ごとの部署名を、内部結合の代わりにSELECT句の相関サブクエリ（スカラサブクエリ）で取り出した。PostgreSQLの実行計画で、Departmentsを読む処理は何回実行された？",
    choices: [
      { text: "1回", ok: false, note: "1回で済むのは内部結合のHash Joinです。Departmentsを1回読んでハッシュテーブルを作っています。" },
      { text: "4回", ok: false, note: "Departmentsの行数ではなく、外側のクエリの行数だけ実行されます。" },
      { text: "6回", ok: true, note: "SubPlan 1のSeq Scan on departmentsにloops=6とあります。Employeesの6行それぞれについてサブクエリを実行しています。読んだページも、内部結合の2に対して7です。" },
      { text: "24回", ok: false, note: "クロス結合の行数です。サブクエリは外側の1行につき1回です。" },
    ],
    show: [{ q: "inner_join", tag: "内部結合" }, { q: "inner_sub", tag: "相関サブクエリ" }], showDefault: 1,
    takeaway: "dept_idはDepartmentsの主キーなので、このサブクエリは必ず1行を返し、スカラサブクエリとして使えます。ただし<b>結果の行数だけサブクエリを実行するので、結合で書けるなら結合を選ぶ。</b>MySQLも「dependent」なサブクエリとしてloops=6で実行しています。",
  },
  {
    type: "q", sec: "6.1 機能から見た結合の種類", title: "社員のいない部署も結果に残す", ref: "kind", table: ["employees", "departments"],
    prompt: "部署ごとの社員の一覧を作る。社員がいない営業部も、社員の列をNULLにして結果に残したい。正しい結果を返すのはどれ？",
    choices: [
      { q: "left_dept", tag: "Departmentsを左に", ok: true, note: "マスタにしたいDepartmentsを左に書いた左外部結合です。結果は7行で、最後の行が営業部です。psqlはNULLを空欄で表示します。" },
      { q: "left_emp", tag: "Employeesを左に", ok: false, note: "左外部結合ですが、マスタになっているのは左のEmployeesです。社員は全員が部署を持つので、内部結合と同じ6行になります。" },
      { q: "inner_join", tag: "INNER JOIN", ok: false, note: "内部結合は両方のテーブルに一致する行だけを返すので6行です。営業部は消えます。" },
    ],
    show: [{ q: "left_dept", tag: "Departmentsを左に" }, { q: "left_emp", tag: "Employeesを左に" }, { q: "inner_join", tag: "INNER JOIN" }, { q: "right_dept", tag: "RIGHT OUTER JOIN" }],
    takeaway: "<b>外部結合はマスタ側のテーブルの行を残し、相手がなければNULLを作る。</b>マスタを右に書けばRIGHT OUTER JOINで、結果は同じです（実行計画タブのRIGHT OUTER JOIN）。NULLを含む最後の行はクロス結合のどの行とも一致しません。これが「外部」の由来です。",
  },
  {
    type: "q", sec: "6.1 機能から見た結合の種類", title: "自己結合で連番を作る", ref: "kind", table: ["digits"],
    prompt: "0〜9を持つDigitsを自分自身とクロス結合し、D1.digit + D2.digit * 10を計算する。結果は何行？",
    choices: [
      { text: "1行", ok: false, note: "集約はしていないので、組み合わせの数だけ行が返ります。" },
      { text: "10行", ok: false, note: "自己結合でも、別名D1とD2を別のテーブルとみなして数えます。" },
      { text: "20行", ok: false, note: "足し算ではなく掛け算です。" },
      { text: "100行", ok: true, note: "10×10=100行で、0〜99の連番になります。実行計画では、同じdigitsテーブルがd1とd2として2回読まれています。" },
    ],
    show: [{ q: "self_cross", tag: "自己結合＋クロス結合" }],
    takeaway: "<b>自己結合は、同じデータを持つ別名のテーブル同士の結合として読む。</b>結果を基準にした分類ではないので、クロス結合や外部結合とも組み合わせられます。ORDER BY句がないので、結果タブの順序は不定です。",
  },
  {
    type: "q", sec: "6.2 結合のアルゴリズムとパフォーマンス", title: "駆動表はどちらか", ref: "plan", table: ["shops", "orders"], tableNote: SHOPS_NOTE,
    prompt: "大阪府の5店舗の注文を、ShopsとOrdersの結合で取り出す。PostgreSQLの実行計画で、Nested Loopの駆動表（外側のループで読むテーブル）はどちら？",
    choices: [
      { text: "Shops", ok: true, note: "Nested Loopの直下で上に書かれたSeq Scan on shopsが駆動表です。areaで絞った5行について、内部表のOrdersをインデックスidx_orders_shopで探しています（loops=5）。" },
      { text: "Orders", ok: false, note: "OrdersのIndex Scanにloops=5とあるとおり、駆動表の1行ごとに5回探されている内部表です。" },
      { text: "同時に読むので区別がない", ok: false, note: "Nested Loopsは二重ループです。外側の駆動表を1行ずつ読み、その都度内部表を探します。" },
      { text: "実行するまで決まらない", ok: false, note: "実行計画の段階で決まっています。" },
    ],
    show: [{ q: "nl_area", tag: "大阪府の店舗の注文" }, { q: "join_all", tag: "全店舗の注文" }],
    takeaway: "<b>小さな駆動表と、内部表の結合キーのインデックス。</b>この組み合わせがNested Loopsを速くする基本です。MySQLも同じ形で、Table scan on Sが駆動表、Index lookup on Oが内部表です。絞り込みをなくして全店舗の注文を取ると、PostgreSQLはShopsをBuild表にしたHash Joinに切り替えました。MySQLはNested Loopsのままです。",
  },
  {
    type: "q", sec: "6.2 結合のアルゴリズムとパフォーマンス", title: "「駆動表を小さく」の前提", ref: "algo",
    prompt: "Nested Loopsでは「駆動表を小さく」が定石とされる。この定石が効果を持つために必要な前提はどれ？",
    choices: [
      { text: "内部表の結合キーにインデックスがあること", ok: true, note: "インデックスがあれば、駆動表の1行ごとに内部表を全部ループせずに済みます。結合キーが内部表で一意なら内部表のループは1回で済み、アクセスする行数はR(A)×2になります。" },
      { text: "駆動表の結合キーにインデックスがあること", ok: false, note: "駆動表は1回全件を読むだけなので、結合キーのインデックスは効きません。" },
      { text: "両方のテーブルが結合キーでソート済みであること", ok: false, note: "それはSort Mergeがソートを省ける条件です。" },
      { text: "ワーキングメモリが十分にあること", ok: false, note: "Nested Loopsはメモリをあまり使いません。メモリが問題になるのはHashとSort Mergeです。" },
    ],
    takeaway: "インデックスがないと、内部表はループのたびに全件読まれ、駆動表の大小はあまり意味を持ちません。<b>裏返せば「内部表を大きく」で、内部表が大きいほどインデックスでループを省く効果が大きい。</b>",
  },
  {
    type: "q", sec: "6.2 結合のアルゴリズムとパフォーマンス", title: "ハッシュ結合のBuild表", ref: "algo", table: ["employees", "departments"],
    prompt: "EmployeesとDepartmentsの内部結合で、PostgreSQL 16はHash Joinを選んだ。ハッシュテーブルを作る側（Build表）はどちら？",
    choices: [
      { text: "Departments", ok: true, note: "Hashノードの下にあるSeq Scan on departmentsがBuild表です。4行からハッシュテーブルを作り、Employeesの6行を順に照合（Probe）します。小さいほうをBuild表にするのは、ハッシュテーブルをワーキングメモリに置くためです。" },
      { text: "Employees", ok: false, note: "EmployeesはHashノードの外側にあるので、ハッシュテーブルと照合されるProbe表です。" },
      { text: "両方のテーブルからハッシュテーブルを作る", ok: false, note: "ハッシュテーブルを作るのは片方だけです。" },
    ],
    show: [{ q: "inner_join", tag: "INNER JOIN" }],
    takeaway: "本書の図と同じ計画です。<b>Hashは両方のテーブルを全件読むので、どちらもSeq Scanになる。</b>MySQLは同じSQLをNested Loopsで実行し、Departmentsを主キーで1行ずつ探しました（Single-row index lookup）。MySQLがHashを選ぶのは、結合条件に使えるインデックスがない場合などに限られます。",
  },
  {
    type: "q", sec: "6.2 結合のアルゴリズムとパフォーマンス", title: "同じSQLで店舗を変えると", ref: "plan", table: ["shops", "orders"], tableNote: SHOPS_NOTE,
    prompt: "店舗IDで絞った注文を取り出す。注文の半分を占める店舗00001と、約1,000件の店舗00002で、同じ形のSQLを実行した。PostgreSQLの実行計画はどう違った？",
    choices: [
      { text: "店舗00001ではOrdersがSeq Scanに変わった", ok: false, note: "Ordersはshop_idの順に格納されているので、50,000行でもインデックスのほうが安いとPostgreSQLは判断しました。" },
      { text: "店舗00001ではHash Joinに変わった", ok: false, note: "Shopsが1行に絞られるので、どちらもNested Loopのままです。" },
      { text: "どちらもIndex Scanだが、店舗00001はヒット件数が約50倍で、読んだページは約36倍", ok: true, note: "計画の形は同じNested Loop＋Index Scanですが、内部表のヒット件数が1,021行と50,000行で違います。読んだページも10に対して364（キャッシュから322、ストレージ側から42）です。" },
      { text: "どちらも同じページ数を読んだ", ok: false, note: "内部表のヒット件数が違うので、読む量も違います。" },
    ],
    show: [{ q: "trap_light", tag: "店舗00002（約1,000件）" }, { q: "trap_heavy", tag: "店舗00001（50,000件）" }], showDefault: 1,
    takeaway: "<b>SQLが同じでも、パラメータで内部表のヒット件数が変わると性能は大きくばらつく。</b>これがNested Loopsの落とし穴です。対策は、大きいテーブルを駆動表にして内部表を主キーで引くか、Hashを検討すること。MySQLはShopsを定数として先に解決し、Ordersへのアクセスだけを計画に表示しました。",
  },
  {
    type: "q", sec: "6.2 結合のアルゴリズムとパフォーマンス", title: "Sort Mergeを試す", ref: "algo", table: ["employees", "departments"],
    prompt: "PostgreSQLでenable_nestloopとenable_hashjoinをoffにして、EmployeesとDepartmentsの内部結合を実行した。実行計画はどうなった？",
    choices: [
      { text: "両方のテーブルをdept_idでSortしてからMerge Joinした", ok: true, note: "Sort Mergeは結合キーで両方を並べ替えてから突き合わせます。SortノードがEmployeesとDepartmentsの両方に付いています。" },
      { text: "エラーになった", ok: false, note: "パラメータは選べるアルゴリズムを制限するだけです。残ったMerge Joinが使われます。" },
      { text: "設定を無視してHash Joinのままだった", ok: false, note: "enable_hashjoin = offでHash Joinのコストが大きく見積もられ、選ばれなくなります。" },
      { text: "MySQLと同じNested Loopになった", ok: false, note: "Nested Loopもoffにしています。MySQLはSort Mergeをサポートしないので、同じSQLでもNested Loopsのままです（MySQL 8.0の計画）。" },
    ],
    show: [{ q: "merge_join", tag: "Sort Merge（強制）" }],
    takeaway: "Sort Mergeは等値結合に加えて不等号（<、>など）の結合にも使えますが、否定条件（<>）には使えません。<b>ソートのコストが大きいので、ソート済みのデータを使える例外的な場合を除き、Nested LoopsとHashが優先。</b>enable_*のパラメータは影響範囲が大きいので、本番では慎重に扱います。",
  },
  {
    type: "q", sec: "6.2 結合のアルゴリズムとパフォーマンス", title: "三角結合で起きること", ref: "algo", table: ["table_a", "table_b", "table_c"], tableNote: TRI_NOTE,
    prompt: "3つのテーブルを結合するが、結合条件があるのはTable_AとTable_B、Table_AとTable_Cの間だけ。Oracleの実行計画にMERGE JOIN CARTESIANが現れた。何が起きている？",
    code: "SELECT A.col_a, B.col_b, C.col_c\n  FROM Table_A A\n       INNER JOIN Table_B B\n          ON A.col_a = B.col_b\n       INNER JOIN Table_C C\n          ON A.col_a = C.col_c;",
    choices: [
      { text: "結合条件のないTable_BとTable_Cが先にクロス結合され、その結果とTable_Aが結合された", ok: true, note: "オプティマイザがTable_BとTable_Cを十分小さいと見積もると、先に2つを掛け合わせてからTable_Aに1回だけ当たる計画を選ぶことがあります。小さなマスタ同士なら問題ありませんが、大きなテーブルで起きると遅くなります。" },
      { text: "Table_Aが2回読まれ、結果が重複した", ok: false, note: "結果は変わりません。変わるのは結合の順序とアルゴリズムです。" },
      { text: "構文エラーで実行されない", ok: false, note: "結合条件はどのJOINにも書かれているので、構文上は正しいクエリです。" },
    ],
    show: [{ q: "tri_join", tag: "三角結合" }, { q: "tri_redundant", tag: "冗長な条件を追加" }],
    takeaway: "回避策は、結果を変えない範囲でTable_BとTable_Cの間にも結合条件を足すこと。<b>冗長な結合条件は、オプティマイザの選択肢を増やす。</b>PostgreSQL 16とMySQL 8.0では、1,000行のTable_Aと3行ずつのTable_B、Table_Cでクロス結合は現れませんでした。MySQLはTable_BとTable_Cを先に結合していますが、A=BとA=Cから導いたB=Cの条件（col_c=B.col_b）を使っています。条件を足しても計画は変わりませんでした。",
  },
  {
    type: "q", sec: "6.3 結合が遅いなと感じたら", title: "Hashの使いどころ", ref: "algo",
    prompt: "Hash結合の使いどころとして、本書が挙げていないのはどれ？",
    choices: [
      { text: "Nested Loopsの駆動表にできる小さなテーブルがない場合", ok: false, note: "本書が挙げている場合です。大規模なテーブル同士の結合にはまずHashを検討します。" },
      { text: "駆動表は小さいが、内部表のヒット件数が多い場合", ok: false, note: "本書が挙げている場合です。Nested Loopsの落とし穴への対策の1つがHashです。" },
      { text: "内部表の結合キーにインデックスを作れない場合", ok: false, note: "本書が挙げている場合です。インデックスがなければNested Loopsは効率よく動きません。" },
      { text: "同時実行の多いOLTPで応答時間を縮めたい場合", ok: true, note: "Hashはハッシュテーブルを作るためにメモリを多く使います。同時実行の多いOLTPではワーキングメモリが枯渇し、TEMP落ちで遅くなるリスクがあります。使いどころは夜間バッチやBI/DWHのような、同時実行の少ない処理です。" },
    ],
    takeaway: "<b>1にNested Loops、2にHash。</b>Hashは両方のテーブルを全件読むので、フルスキャンの時間も考慮します。結合対象の規模は、テーブル全体ではなく絞り込んだ後の行数で考えます。",
  },
  {
    type: "q", sec: "6.3 結合が遅いなと感じたら", title: "実行計画が揺れる理由", ref: "algo",
    prompt: "長く運用していると、ある日突然SQLが遅くなることがある。本書が「実行計画の変動を最も引き起こしやすい」とする演算と、その理由はどれ？",
    choices: [
      { text: "結合。選べるアルゴリズムが複数あり、統計情報の変化で切り替わるから", ok: true, note: "データ量の増加で統計情報が変わり、ある閾値を超えるとオプティマイザが別の結合アルゴリズムに切り替えます。良い方向に変わるとは限りません。" },
      { text: "集約。GROUP BYはハッシュとソートを切り替えるから", ok: false, note: "集約も切り替わりますが、本書が性能問題の火薬庫と呼ぶのは結合です。" },
      { text: "ソート。ORDER BYはメモリが足りないとTEMP落ちするから", ok: false, note: "TEMP落ちは遅くなる原因ですが、実行計画そのものが変わる話ではありません。" },
      { text: "更新。ロックの競合が増えるから", ok: false, note: "ロックは本章の範囲外です。" },
    ],
    takeaway: "対策の1つはヒント句で計画を固定することですが、将来のデータに合わなくなるリスクがあります。<b>性能の変動を抑えるには、ウィンドウ関数などで結合そのものを避けるのが重要な戦略。</b>これが本書の後半のテーマです。",
  },
  {
    type: "q", sec: "演習問題6", title: "EXISTS述語の実行計画", ref: "algo", table: ["employees", "departments"],
    prompt: "社員がいる部署をEXISTS述語で取り出す。PostgreSQLとMySQLの実行計画に共通して現れる、通常の結合にはないキーワードはどれ？",
    choices: [
      { text: "Semi", ok: true, note: "PostgreSQLはHash Semi Join、MySQLはHash semijoinです。半結合（Semi-Join）は、内部表に一致する行を1行見つけた時点で探すのをやめ、駆動表の行を1行だけ返します。本書の解答と同じ計画です。" },
      { text: "Anti", ok: false, note: "AntiはNOT EXISTSの計画に現れます（実行計画タブのNOT EXISTS）。" },
      { text: "Materialize", ok: false, note: "どちらの計画にも出ていません。" },
      { text: "Cartesian", ok: false, note: "クロス結合のキーワードです。EXISTSの中には結合条件があります。" },
    ],
    show: [{ q: "exists", tag: "EXISTS" }, { q: "not_exists", tag: "NOT EXISTS" }, { q: "not_in", tag: "NOT IN" }],
    takeaway: "半結合は存在の確認しかしないので、1対Nの結合でも行が増えず、ループ回数も減ります。<b>EXISTSで書ける結合はEXISTSで書くのが性能改善の常套手段。</b>NOT EXISTSは反結合（Anti-Join）になり、PostgreSQLはHash Right Anti Join、MySQLはHash antijoinでした。本書のMySQLの計画はNested loop antijoinですが、これは著者の環境にEmployees.dept_idのインデックスがあるためです。",
  },
  {
    type: "q", sec: "演習問題6", title: "NOT INは反結合になるか", ref: "algo", table: ["employees", "departments"],
    prompt: "NOT EXISTSをNOT INに書き換えて、社員がいない部署を取り出した。PostgreSQLの実行計画はどうなった？",
    choices: [
      { text: "NOT EXISTSと同じHash Right Anti Join", ok: false, note: "計画は変わりました。NOT EXISTSとNOT INは、結果も実行計画も同じになるとは限りません。" },
      { text: "DepartmentsのSeq Scanを、サブクエリの結果をハッシュ化したSubPlanでフィルタした", ok: true, note: "Employeesを1回読んでハッシュ化し（hashed SubPlan 1）、Departmentsの各行をそれで除外しています。反結合ではありません。結果は同じ営業部の1行です。" },
      { text: "Nested Loop Anti Join", ok: false, note: "反結合は現れませんでした。" },
      { text: "エラーになった", ok: false, note: "NOT INは標準SQLの述語です。" },
    ],
    show: [{ q: "not_exists", tag: "NOT EXISTS" }, { q: "not_in", tag: "NOT IN" }], showDefault: 1,
    takeaway: "EXISTSとINは結果が同値で実行計画も同じになりやすいのに対し、<b>NOT EXISTSとNOT INは結果が同値でないうえ、実行計画も同じとは限らない。</b>サブクエリの結果にNULLが含まれると、NOT INは1行も返しません。MySQLもNOT INを反結合にはせず、重複を除いた一時テーブルで照合しています。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  kind: () => `<div class="grid">
      <div class="col">
        <div class="label">結果の形で分類した3つの結合（EmployeesとDepartmentsの例）</div>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>結合</th><th>構文</th><th>結果の行数</th></tr></thead>
          <tbody>
            <tr><td>クロス結合</td><td>CROSS JOIN</td><td>6×4=24行</td></tr>
            <tr><td>内部結合</td><td>INNER JOIN ... ON</td><td>条件に合う6行</td></tr>
            <tr><td>外部結合</td><td>LEFT / RIGHT / FULL OUTER JOIN ... ON</td><td>マスタ側を残して7行</td></tr>
          </tbody></table></div>
        <ul class="points">
          <li>クロス結合は、2つのテーブルの行のすべての組み合わせを返します。行数は掛け算で、最もコストの高い結合です。</li>
          <li>内部結合は結合条件に合う組み合わせだけを返すので、必ずクロス結合の部分集合になります。</li>
          <li>外部結合はマスタ側の行を残し、相手がなければNULLを作ります。NULLを含む行はクロス結合にないので、部分集合になるとは限りません。</li>
          <li>内部結合と外部結合は排他的です。等値／非等値結合や自己結合は結果の形による分類ではなく、これらと組み合わせられます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">自然結合とUSING句</div>
        ${pre("SELECT * FROM Employees NATURAL JOIN Departments;\n\nSELECT * FROM Employees INNER JOIN Departments\n USING (dept_id);")}
        <ul class="points">
          <li>自然結合は、同じ名前の列を暗黙に等号で結びます。結合条件を書かないので、テーブル定義を知らないと読めません。</li>
          <li>USING句は結合に使う列名を明示しますが、等値条件しか書けず、列名が違うテーブルには使えません。</li>
          <li>特別な事情がなければ、結合条件をONに書く内部結合で十分です。</li>
        </ul>
        <p class="takeaway">結合条件を書き忘れると、意図しないクロス結合（うっかりクロス結合）になります。<b>JOIN構文なら、結合条件がないときに構文エラーで止まるDBMSもある。</b></p>
      </div>
    </div>`,
  algo: () => `<div class="grid">
      <div class="col">
        <ul class="points">
          <li><b>Nested Loops</b>：駆動表を1行ずつ読み、その都度内部表を探す二重ループです。小さな駆動表と内部表の結合キーのインデックスがあれば速く、メモリをあまり使わないのでOLTPに向きます。非等値結合にも使えます。</li>
          <li><b>Hash</b>：小さいほう（Build表）からハッシュテーブルを作り、もう一方（Probe表）を照合します。大規模なテーブル同士や、インデックスのない結合に向きます。等値結合でしか使えず、メモリを多く使うので、足りないとTEMP落ちします。</li>
          <li><b>Sort Merge</b>：両方を結合キーでソートしてから突き合わせます。不等号の結合にも使えますが（否定条件は不可）、ソートのコストが大きく、MySQLはサポートしていません。</li>
        </ul>
        <p class="takeaway"><b>1にNested Loops、2にHash。</b>小-小ならどれでも大差なし、小-大なら小を駆動表にしたNested Loops、大-大ならまずHashです。</p>
      </div>
      <div class="col">
        <div class="label">実行計画での表記</div>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>アルゴリズム</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
          <tbody>
            <tr><td>Nested Loops</td><td>Nested Loop</td><td>Nested loop inner join</td></tr>
            <tr><td>Hash</td><td>Hash Join、Hash</td><td>Inner hash join、Hash</td></tr>
            <tr><td>Sort Merge</td><td>Merge Join、Sort</td><td>（なし）</td></tr>
            <tr><td>クロス結合</td><td>条件のないNested Loop</td><td>Inner hash join (no condition)</td></tr>
            <tr><td>半結合・反結合</td><td>Hash Semi Join、Hash Anti Join</td><td>Hash semijoin、Hash antijoin</td></tr>
          </tbody></table></div>
        <ul class="points">
          <li>駆動表（外部表）は二重ループの外側で読むテーブルです。外部結合とは関係ありません。</li>
          <li>Nested Loopsの性能は駆動表の行数と、内部表の1回あたりのヒット件数で決まります。</li>
          <li>どのアルゴリズムが選ばれるかは統計情報で変わるので、結合は実行計画の変動が起きやすい演算です。</li>
        </ul>
      </div>
    </div>`,
  plan: () => {
    const r = analyze(D.nl_area.pg, "pg");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">実行計画は木の形をしていて、インデントの深い行から先に実行します。結合のノードには子が2つあり、同じ深さなら上の子が先です。</p>
        <ul class="points">
          <li><b>Nested Loop</b>：上の子が駆動表、下の子が内部表です。内部表のloops=Nは、駆動表の行ごとにN回実行されたことを表します。内部表の行がIndex Scanなら、結合キーのインデックスが使われています。</li>
          <li><b>Hash Join</b>：Hashノードの下にあるテーブルがBuild表で、先に読まれます。もう一方がProbe表です。</li>
          <li><b>Merge Join</b>：両方の子にSortが付きます。</li>
        </ul>
        <div class="label">MySQLの場合</div>
        <ul class="points">
          <li>Nested loop inner joinの上の子が駆動表、下の子が内部表です。Index lookup on O using idx（shop_id=S.shop_id）が、内部表をインデックスで探す行です。</li>
          <li>Inner hash joinでは、Hashノードの下がBuild表です。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">例：大阪府の店舗の注文（6.2の問題）</div>
        ${pre(D.nl_area.sql)}
        <div class="label">PostgreSQLの実行計画</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>Seq Scan on shopsが駆動表です。areaで絞り込み、5行が残ります。</li>
          <li>Index Scan on ordersが内部表です。loops=5は、駆動表の5行それぞれについてインデックスで探したことを表し、1回あたり1,021行を返しています。</li>
          <li>Nested Loopが2つを組み合わせ、5,105行を返します。</li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
};

const CH = {
  no: 6,
  store: "sql-jissen-ch6-drill-v1",
  h1: "結合<br>結合を制する者はSQLを制す",
  lede: () => `結合の種類と3つの結合アルゴリズムを${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画と結果が表示されます。どちらのテーブルを先に読み、もう一方をどう探しているかを比べてください。`,
  points: [
    "結合はSQLの性能問題の火薬庫。",
    "基本はNested Loops。HashはバッチやBI/DWHに限定し、使うときはTEMP落ちに注意する。",
    "Nested Loopsが効率よく動くには、小さな駆動表と内部表のインデックスが要る。",
    "結合はアルゴリズムが複数あるので、実行計画の変動が起きやすい。ヒント句で固定できるが、リスクのある手段。",
    "実行計画の揺れを防ぐには、結合を避けることが重要な戦略になる。",
  ],
};
