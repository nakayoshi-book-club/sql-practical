const T = {
  address: { name: "Address（住所）", cols: ["name", "phone_nbr", "address", "sex", "age"], rows: [
    ["小川","080-3333-XXXX","東京都","男",30],["前田","090-0000-XXXX","東京都","女",21],["森","090-2984-XXXX","東京都","男",45],
    ["林","080-3333-XXXX","福島県","男",32],["井上",null,"福島県","女",55],["佐々木","080-5848-XXXX","千葉県","女",19],
    ["松本",null,"千葉県","女",20],["佐藤","090-1922-XXXX","三重県","女",25],["鈴木","090-0001-XXXX","和歌山県","男",32]] },
  address2: { name: "Address2（住所2）", cols: ["name", "phone_nbr", "address", "sex", "age"], rows: [
    ["小川","080-3333-XXXX","東京都","男",30],["林","080-3333-XXXX","福島県","男",32],["武田",null,"福島県","男",18],
    ["斉藤","080-2367-XXXX","千葉県","女",19],["上野",null,"千葉県","女",20],["広田","090-0205-XXXX","三重県","男",25]] },
};

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "plan", title: "SQLの部品と実行計画のノード" },
  { type: "intro", id: "select", title: "SELECT文とWHERE句" },
  { type: "intro", id: "group", title: "GROUP BY・HAVING・ORDER BY" },
  { type: "intro", id: "view", title: "ビュー・サブクエリ・CASE式" },
  { type: "intro", id: "set", title: "集合演算とウィンドウ関数" },
  { type: "intro", id: "update", title: "INSERT・DELETE・UPDATE" },
  {
    type: "q", sec: "2.1 SELECT文", title: "電話番号のない人を選ぶ", table: ["address"], ref: "select",
    prompt: "電話番号（phone_nbr）が登録されていない井上さんと松本さんを選びたい。正しく2人を返すのはどれ？",
    choices: [
      { q: "null_eq", tag: "= NULL", ok: false, note: "エラーにはなりませんが、1行も返りません。PostgreSQLは「この条件は真にならない」と判断し、テーブルを読む前に終了しています（One-Time Filter: false）。" },
      { q: "null_is", tag: "IS NULL", ok: true, note: "NULLを選ぶにはIS NULLを使います。NULLでない行を選ぶならIS NOT NULLです。" },
      { q: "null_empty", tag: "= ''", ok: false, note: "空文字とNULLは別のものです。空文字の行はないので、0行です。" },
      { q: "null_ne", tag: "<> NULL", ok: false, note: "= NULLと同じく、NULLとの比較は真にならないので0行です。" },
    ],
    takeaway: "NULLは値ではないので、等号などの比較演算子が使えません。<b>NULLの判定はIS NULLとIS NOT NULLで書く。</b>",
  },
  {
    type: "q", sec: "2.1 SELECT文", title: "2つの条件を組み合わせる", table: ["address"], ref: "select",
    prompt: "「東京都に住んでいて、かつ30歳以上」の人を選びたい。正しいのはどれ？",
    choices: [
      { q: "and_ge", tag: "AND と >=", ok: true, note: "小川さん（30歳）と森さん（45歳）の2人です。ANDは2つの条件の積集合を取ります。" },
      { q: "or_ge", tag: "OR と >=", ok: false, note: "ORは和集合なので、「東京都に住む人」と「30歳以上の人」をすべて合わせた6人が返ります。" },
      { q: "and_gt", tag: "AND と >", ok: false, note: "> は「より大きい」なので、30歳ちょうどの小川さんが外れて1人になります。" },
    ],
    takeaway: "<b>WHERE句は巨大なベン図。</b>ANDは積集合、ORは和集合です。実行計画では、どちらもFilterの1行にまとまります。",
  },
  {
    type: "q", sec: "2.1 SELECT文", title: "キーなしのGROUP BY", table: ["address"], ref: "group",
    prompt: "GROUP BY ( ) と書くと、テーブル全体を1つのグループとして集計できる。この書き方で全員の人数を数えるSQLを、MySQL 8.0で実行するとどうなる？",
    choices: [
      { text: "9を返す", ok: false, note: "PostgreSQLでは9を返しますが、MySQLでは違います。" },
      { text: "構文エラーになる", ok: true, note: "MySQLはGROUP BY ( )に対応していないので、構文エラーになります。GROUP BY句を省略すれば、どのDBMSでも9を返します。" },
      { text: "0を返す", ok: false, note: "MySQLではそもそも実行できません。" },
      { text: "1行も返さない", ok: false, note: "MySQLではそもそも実行できません。" },
    ],
    show: [{ q: "all_group_empty", tag: "GROUP BY ( )" }, { q: "all_nogroup", tag: "GROUP BYなし" }], db: "my",
    takeaway: "GROUP BY句を省略したSQLは、キーが空のGROUP BYと同じ意味です。<b>GROUP BYを書かない集計は、テーブル全体を1つのホールケーキとして扱う。</b>",
  },
  {
    type: "q", sec: "2.1 SELECT文", title: "集計結果で絞り込む", table: ["address"], ref: "group",
    prompt: "住んでいる人が1人だけの都道府県を選びたい。正しいのはどれ？",
    choices: [
      { q: "having_ok", tag: "HAVING", ok: true, note: "三重県と和歌山県が返ります。実行計画では、HashAggregateが集約したあとにFilterをかけています。" },
      { q: "having_where", tag: "WHERE", ok: false, note: "エラーです。WHERE句は集約する前の行に対する条件なので、COUNT(*)は書けません。" },
    ],
    takeaway: "<b>WHERE句は行に対する条件、HAVING句は行の集合に対する条件。</b>",
  },
  {
    type: "q", sec: "2.1 SELECT文", title: "ORDER BYを書かないときの並び順", table: ["address"], ref: "group",
    prompt: "ORDER BYを書かずにAddressの全員を選んだ。結果の行はどんな順に並ぶ？",
    choices: [
      { text: "主キー（name）の順", ok: false, note: "MySQLはこの順で返しましたが、PostgreSQLは違う順でした。結果タブで比べてください。" },
      { text: "データを入れた順", ok: false, note: "PostgreSQLはこの順で返しましたが、MySQLは違う順でした。" },
      { text: "決まっていない", ok: true, note: "SQLの規則としては順序が決まっていません。同じデータでも、PostgreSQLは入れた順、MySQLは主キーの順で返しました。" },
      { text: "年齢の高い順", ok: false, note: "年齢順にするにはORDER BY age DESCが必要です。実行計画にSortが加わります。" },
    ],
    show: [{ q: "order_none", tag: "ORDER BYなし" }, { q: "order_age", tag: "ORDER BY age DESC" }],
    takeaway: "<b>並び順が必要なら、必ずORDER BYを書く。</b>",
  },
  {
    type: "q", sec: "2.1 SELECT文", title: "ビューとサブクエリの実行計画", table: ["address"], ref: "view",
    prompt: "ビューCountAddressから選ぶSQLと、ビューの中身をFROM句のサブクエリに展開したSQLがある。PostgreSQLの実行計画はどうなった？",
    choices: [
      { text: "まったく同じになった", ok: true, note: "ビューはSELECT文を保存しただけで、データを持ちません。実行時にサブクエリへ展開されるので、計画も同じになります。" },
      { text: "ビューのほうが速い計画になった", ok: false, note: "ビューは結果を保存していないので、毎回Addressを読んで集計します。" },
      { text: "サブクエリのほうが速い計画になった", ok: false, note: "2つの計画に違いはありません。" },
      { text: "ビューのほうはエラーになった", ok: false, note: "ビューはテーブルと同じようにSELECTできます。" },
    ],
    show: [{ q: "view_use", tag: "ビューから選ぶ" }, { q: "view_sub", tag: "サブクエリに展開" }],
    takeaway: "<b>ビューは名前の付いたサブクエリ。</b>SELECT文は入力と出力がどちらもテーブルなので、FROM句にSELECT文を入れられます。",
  },
  {
    type: "q", sec: "2.1 SELECT文", title: "IN（サブクエリ）の処理のされ方", table: ["address", "address2"], ref: "view",
    prompt: "Address2にもいる人をAddressから選ぶ。本書は「サブクエリが先に実行され、定数のリストに展開される」と説明している。PostgreSQL 16の実行計画では、IN（サブクエリ）はどう処理された？",
    choices: [
      { text: "定数のリストに展開してFilterで絞り込んだ", ok: false, note: "そうなるのは、最初から定数を書いたINのときです（ANY ('{小川,林,…}')）。" },
      { text: "Address2との結合（Hash Join）に変換した", ok: true, note: "PostgreSQLはAddress2からハッシュ表を作り、Addressの各行と突き合わせています。MySQLも、Address2を先に読む結合へ変換しました。結果は小川さんと林さんで、本書と同じです。" },
      { text: "Addressの1行ごとにサブクエリを実行した", ok: false, note: "Address2のSeq Scanは1回（loops=1）だけです。" },
      { text: "エラーになった", ok: false, note: "INはサブクエリを引数に取れます。" },
    ],
    show: [{ q: "in_sub", tag: "IN（サブクエリ）" }, { q: "in_const", tag: "IN（定数）" }],
    takeaway: "意味は同じでも、オプティマイザは速そうな手順に書き換えます。<b>実際の手順は実行計画で確かめる。</b>",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "CASE式のWHENの順番", table: ["address"], ref: "view",
    prompt: "年齢で区分を付けるCASE式で、WHEN age >= 30を先に、WHEN age >= 40をあとに書いた。森さん（45歳）のage_groupは何になる？",
    choices: [
      { text: "40歳以上", ok: false, note: "WHENは上から順に評価します。age >= 40を評価する前に終わります。" },
      { text: "30歳以上", ok: true, note: "最初のWHEN（age >= 30）が真になった時点で、CASE式は「30歳以上」を返して終わります。40歳以上の区分は、45歳の森さんと55歳の井上さんのどちらにも付きません。" },
      { text: "NULL", ok: false, note: "条件に合うWHENがあるので、NULLにはなりません。" },
      { text: "エラーになる", ok: false, note: "条件が重なっていてもエラーにはなりません。" },
    ],
    show: [{ q: "case_order", tag: "CASE式" }],
    takeaway: "<b>CASE式は、最初に真になったWHENで止まる。</b>範囲で区切るときは、狭い条件から先に書きます。",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "UNIONの行数", table: ["address", "address2"], ref: "set",
    prompt: "Address（9行）とAddress2（6行）をUNIONすると、何行になる？",
    choices: [
      { text: "15行", ok: false, note: "15行になるのはUNION ALLです。" },
      { text: "13行", ok: true, note: "小川さんと林さんは両方のテーブルにまったく同じ行があるので、UNIONが重複を1行にまとめて13行になります。実行計画ではAppendの上のHashAggregateが重複を除いています。" },
      { text: "9行", ok: false, note: "Address2にしかいない4人も加わります。" },
      { text: "6行", ok: false, note: "UNIONは両方のテーブルの行を合わせます。" },
    ],
    show: [{ q: "set_union", tag: "UNION" }, { q: "set_union_all", tag: "UNION ALL" }],
    takeaway: "<b>UNIONは重複を除き、UNION ALLは除かない。</b>重複除去の分だけ処理が増えます。",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "EXCEPTで残る人", table: ["address", "address2"], ref: "set",
    prompt: "Address EXCEPT Address2 の結果に含まれないのは誰？",
    choices: [
      { text: "小川さん", ok: true, note: "小川さんはAddress2にもまったく同じ行があるので、差し引かれます。林さんも同じです。残るのは7人です。" },
      { text: "前田さん", ok: false, note: "前田さんはAddress2にいないので残ります。" },
      { text: "井上さん", ok: false, note: "井上さんはAddress2にいないので残ります。" },
      { text: "鈴木さん", ok: false, note: "鈴木さんはAddress2にいないので残ります。" },
    ],
    show: [{ q: "set_except", tag: "EXCEPT" }, { q: "set_intersect", tag: "INTERSECT" }],
    takeaway: "<b>INTERSECTは両方にある行、EXCEPTは片方にしかない行。</b>PostgreSQLの実行計画ではHashSetOpが判定しています。",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "ウィンドウ関数が返す行数", table: ["address"], ref: "set",
    prompt: "SELECT address, COUNT(*) OVER(PARTITION BY address) FROM Address は何行を返す？",
    choices: [
      { text: "5行", ok: false, note: "5行になるのは、GROUP BY addressで集約したときです。" },
      { text: "9行", ok: true, note: "ウィンドウ関数は集約しないので、テーブルと同じ9行です。各行に、同じ都道府県の人数が付きます。" },
      { text: "1行", ok: false, note: "PARTITION BYで都道府県ごとに分けても、行はまとめません。" },
      { text: "13行", ok: false, note: "Address2は使っていません。" },
    ],
    show: [{ q: "win_count", tag: "ウィンドウ関数" }, { q: "win_group", tag: "GROUP BY" }],
    takeaway: "<b>ウィンドウ関数は、GROUP BYから集約を除いてカットだけを残したもの。</b>実行計画ではSortで並べてからWindowAggが数えています。",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "同じ年齢がいるときの順位", table: ["address"], ref: "set",
    prompt: "RANK() OVER(ORDER BY age DESC) で年齢の高い順に順位を付けた。林さんと鈴木さんがどちらも32歳で3位のとき、小川さん（30歳）は何位？",
    choices: [
      { text: "4位", ok: false, note: "4位になるのは、抜け番を作らないDENSE_RANKのときです。" },
      { text: "5位", ok: true, note: "RANKは同じ値を同じ順位にし、その人数分だけ次の順位を飛ばします。3位が2人いるので、次は5位です。" },
      { text: "3位", ok: false, note: "小川さんは32歳の2人より若いので、同じ順位にはなりません。" },
      { text: "6位", ok: false, note: "小川さんより年上は4人なので、5位です。" },
    ],
    show: [{ q: "rank", tag: "RANK" }, { q: "dense_rank", tag: "DENSE_RANK" }],
    takeaway: "<b>RANKは抜け番あり、DENSE_RANKは抜け番なし。</b>",
  },
  {
    type: "q", sec: "演習問題2", title: "男女別の年齢ランキング", table: ["address"], ref: "set",
    prompt: "Addressから、男女別の年齢ランキング（飛び番あり）を年齢の高い順に出したい。正しいのはどれ？",
    choices: [
      { q: "ex_rank_nopart", tag: "PARTITION BYなし", ok: false, note: "性別で並べただけなので、順位が男女を通して1〜9位まで続きます。男性の森さんが6位になっています。" },
      { q: "ex_dense_part", tag: "DENSE_RANK", ok: false, note: "男女別にはなりますが、抜け番がありません。男性の小川さんは、RANKなら4位のところが3位になります。" },
      { q: "ex_rank_part", tag: "PARTITION BY sex と RANK", ok: true, note: "PARTITION BY sexで男女に分け、それぞれで年齢の高い順に順位を付けます。男性は森さんが1位、林さんと鈴木さんが2位、小川さんが4位です。" },
      { q: "ex_rank_asc", tag: "ORDER BY age（昇順）", ok: false, note: "年齢の低い順の順位になります。DESCが必要です。" },
    ],
    takeaway: "<b>「〜別」はPARTITION BY、「〜順」はORDER BY。</b>実行計画では、どれもSortのあとにWindowAggが続きます。",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "複数の列を1回で更新する", table: ["address"], ref: "update",
    prompt: "佐々木さんの電話番号と年齢を、1つのUPDATE文で更新したい。MySQL 8.0でエラーになるのはどれ？",
    choices: [
      { q: "upd_comma", tag: "列をカンマで並べる", ok: false, note: "SET 列 = 値, 列 = 値 の形は、どのDBMSでも使えます。" },
      { q: "upd_row", tag: "列を括弧でまとめる", ok: true, note: "SET (列, 列) = (値, 値) の形は、PostgreSQLでは使えますが、MySQLでは構文エラーになります。" },
    ],
    db: "my",
    takeaway: "<b>迷ったら、列をカンマ区切りで並べる書き方を選ぶ。</b>どちらも表現できる内容は同じです。",
  },
  {
    type: "q", sec: "2.2 条件分岐、集合演算、ウィンドウ関数、更新", title: "1つの列の値だけを消す", table: ["address"], ref: "update",
    prompt: "佐々木さんの電話番号だけを消したい（行は残す）。正しいのはどれ？",
    choices: [
      { q: "del_col", tag: "DELETE 列名 FROM", ok: false, note: "エラーです。DELETE文が消すのは行なので、列を指定できません。" },
      { q: "upd_null", tag: "UPDATE で NULL", ok: true, note: "列の値だけを消すときは、UPDATE文でNULLを入れます。行はそのまま残ります。" },
    ],
    takeaway: "<b>DELETEは行を消し、UPDATEは列の値を変える。</b>全行をDELETEしてもテーブルは残ります。テーブル自体を消すのはDROP TABLEです。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  plan: () => `<p class="prompt">このドリルでは、選択肢のSQLを実行したときの実行計画を表示します。SQLの各部品は、実行計画では次のノードとして現れます。</p>
    <div class="tbl-wrap" style="max-height:none"><table>
      <thead><tr><th>SQLの部品</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
      <tbody>
        <tr><td>FROM（テーブルを全件読む）</td><td>Seq Scan</td><td>Table scan</td></tr>
        <tr><td>WHERE</td><td>Filter</td><td>Filter</td></tr>
        <tr><td>GROUP BY・集約関数</td><td>HashAggregate、Aggregate</td><td>Aggregate using temporary table</td></tr>
        <tr><td>HAVING</td><td>集約ノードのFilter</td><td>Filter</td></tr>
        <tr><td>ORDER BY</td><td>Sort</td><td>Sort</td></tr>
        <tr><td>UNION ALL</td><td>Append</td><td>Append</td></tr>
        <tr><td>UNION</td><td>Append＋HashAggregate</td><td>Union materialize with deduplication</td></tr>
        <tr><td>INTERSECT、EXCEPT</td><td>HashSetOp</td><td>Intersect／Except materialize</td></tr>
        <tr><td>ウィンドウ関数</td><td>Sort＋WindowAgg</td><td>Sort＋Window aggregate</td></tr>
      </tbody></table></div>
    <p class="takeaway">実行計画は、インデントが深い行から先に実行します。<b>ノード名を見れば、SQLのどの部品が何をしているかがわかる。</b></p>`,
  select: () => `<div class="grid">
      <div class="col">
        <div class="label">SELECT文の基本</div>
        ${pre("SELECT name, address   -- 取り出す列\n  FROM Address         -- 元のテーブル\n WHERE address = '千葉県';  -- 行の絞り込み")}
        <ul class="points">
          <li>SELECT文には欲しいデータの条件だけを書き、どう取り出すかはDBMSに任せます。</li>
          <li>WHERE句で使う主な演算子は、=、&lt;&gt;（等しくない）、&gt;=、&gt;、&lt;=、&lt;です。</li>
        </ul>
      </div>
      <div class="col">
        <ul class="points">
          <li>ANDは両方を満たす行（積集合）、ORはどちらかを満たす行（和集合）を選びます。WHERE句は巨大なベン図です。</li>
          <li>同じ列に対するORの並びは、<code>address IN ('東京都', '福島県', '千葉県')</code>のようにINでまとめられます。</li>
          <li>値がわからない欄はNULLです。NULLは値ではないので、= NULLでは選べません。IS NULLかIS NOT NULLで判定します。</li>
        </ul>
      </div>
    </div>`,
  group: () => `<div class="grid">
      <div class="col">
        <div class="label">GROUP BYはケーキを切るナイフ</div>
        ${pre("SELECT sex, COUNT(*)\n  FROM Address\n GROUP BY sex;")}
        <ul class="points">
          <li>GROUP BYはテーブルを列の値でグループに切り分け、グループごとに集約関数で集計します。</li>
          <li>主な集約関数は、COUNT（行数）、SUM（合計）、AVG（平均）、MAX（最大）、MIN（最小）です。</li>
          <li>GROUP BYを書かずに集約関数を使うと、テーブル全体を1つのグループとして集計します。</li>
        </ul>
      </div>
      <div class="col">
        <ul class="points">
          <li>HAVING句は、集約したあとのグループに対する条件です。WHERE句は集約する前の行に対する条件なので、集約関数を書けません。</li>
          <li>ORDER BYを書かないと、結果の並び順は決まっていません。DBMSによっても変わります。</li>
          <li>ORDER BY age DESCのようにDESCを付けると降順、何も付けないかASCを付けると昇順です。</li>
        </ul>
      </div>
    </div>`,
  view: () => `<div class="grid">
      <div class="col">
        <div class="label">ビューとサブクエリ</div>
        ${pre("CREATE VIEW CountAddress (v_address, cnt) AS\nSELECT address, COUNT(*)\n  FROM Address\n GROUP BY address;")}
        <ul class="points">
          <li>ビューはSELECT文に名前を付けて保存したものです。データは持たず、使うたびに中のSELECT文を実行します。</li>
          <li>FROM句やWHERE句の中に書いたSELECT文をサブクエリと呼びます。SELECT文は入力と出力がどちらもテーブルなので、入れ子にできます。</li>
          <li>INの中にサブクエリを書くと、別のテーブルにある値で絞り込めます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">CASE式</div>
        ${pre("CASE WHEN 条件1 THEN 値1\n     WHEN 条件2 THEN 値2\n     ELSE 値3\nEND")}
        <ul class="points">
          <li>WHENを上から順に評価し、最初に真になった分岐の値を返して終わります。どれも真にならなければELSEの値を返します。</li>
          <li>CASE式は値を返す式なので、SELECT句、WHERE句、GROUP BY句、ORDER BY句など、式を書ける場所ならどこにでも書けます。</li>
        </ul>
      </div>
    </div>`,
  set: () => `<div class="grid">
      <div class="col">
        <div class="label">集合演算</div>
        <ul class="points">
          <li>UNIONは2つのSELECT文の結果を合わせ（和集合）、重複した行を1行にまとめます。UNION ALLは重複を残します。</li>
          <li>INTERSECTは両方にある行（積集合）、EXCEPTは前のSELECT文にしかない行（差集合）を返します。どちらも重複した行を除きます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">ウィンドウ関数</div>
        ${pre("SELECT address,\n       COUNT(*) OVER(PARTITION BY address)\n  FROM Address;")}
        <ul class="points">
          <li>GROUP BYは「切り分け」と「集約」をします。ウィンドウ関数は切り分けだけをして、行をまとめません。</li>
          <li>PARTITION BYで切り分け、ORDER BYで並べる順を決めます。</li>
          <li>RANKは同じ値を同じ順位にして次の順位を飛ばします。DENSE_RANKは飛ばしません。</li>
        </ul>
      </div>
    </div>`,
  update: () => `<div class="grid">
      <div class="col">
        <div class="label">INSERT・DELETE</div>
        ${pre("INSERT INTO Address (name, phone_nbr, address, sex, age)\n     VALUES ('小川', '080-3333-XXXX', '東京都', '男', 30);\n\nDELETE FROM Address\n WHERE address = '千葉県';")}
        <ul class="points">
          <li>INSERTのVALUESにカンマ区切りで複数の行を並べると、1回で複数の行を追加できます。</li>
          <li>DELETEは行を消します。列を指定することはできません。WHERE句がないと全行を消しますが、テーブル自体は残ります。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">UPDATE</div>
        ${pre("UPDATE Address\n   SET phone_nbr = '080-5849-XXXX',\n       age = 20\n WHERE name = '佐々木';")}
        <ul class="points">
          <li>SETに「列 = 値」をカンマで並べると、複数の列を1回で更新できます。</li>
          <li>SET (列, 列) = (値, 値) の書き方もありますが、使えないDBMSがあります。</li>
          <li>列の値だけを消したいときは、UPDATEでNULLを入れます。</li>
        </ul>
      </div>
    </div>`,
};

const CH = {
  no: 2,
  store: "sql-jissen-ch2-drill",
  h1: "SQLの基礎<br>母国語を話すがごとく",
  lede: () => `SELECT文から集合演算、ウィンドウ関数、更新までの基本を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのSQLの実行計画と結果が表示されます。`,
  points: [
    "簡単なことを直観的に書けるのが、非手続き型のSQLの良いところ。",
    "CASE式は分岐を表す重要な道具。手続き型の文の代わりに、式で分岐を書く。",
    "クエリは入力と出力がどちらもテーブルなので、柔軟に組み合わせられる。",
    "SQLには、GROUP BY句やUNION、INTERSECTなど集合論にもとづく演算が多い。",
    "ウィンドウ関数は、GROUP BY句から集約を除いて、カットだけを残したもの。",
  ],
};
