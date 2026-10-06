const T = {
  shops: { name: "Shops（店舗）", cols: ["shop_id", "shop_name", "rating", "area"], rows: [
    ["00001","商店00001",3,"青森県"],["00002","商店00002",5,"岩手県"],["00003","商店00003",2,"宮城県"],
    ["00004","商店00004",4,"秋田県"],["00005","商店00005",1,"山形県"],["00006","商店00006",3,"福島県"],
    ["00007","商店00007",5,"東京都"],["00008","商店00008",2,"大阪府"],["00009","商店00009",4,"福岡県"],
    ["00010","商店00010",1,"北海道"]] },
  reservations: { name: "Reservations（予約管理）", cols: ["reserve_id", "shop_id", "reserve_name"], rows: [
    [1,"00001","Aさん"],[2,"00002","Bさん"],[3,"00003","Cさん"],[4,"00004","Dさん"],[5,"00005","Eさん"],
    [6,"00006","Fさん"],[7,"00007","Gさん"],[8,"00008","Hさん"],[9,"00009","Iさん"],[10,"00010","Jさん"]] },
};

const SHOPS_NOTE = "先頭の10行だけを表示しています。本書のShopsは60行ですが、このドリルではインデックスやキャッシュの差が実行計画に出るよう、50,000行（shop_idは00001〜50000）に増やして測定しました。主キーshop_idにインデックスpk_shopsがあります。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "arch", title: "DBMSの中身" },
  { type: "intro", id: "mem", title: "メモリとストレージ" },
  { type: "intro", id: "plan", title: "実行計画の読み方" },
  { type: "intro", id: "stats", title: "統計情報とオプティマイザ" },
  {
    type: "q", sec: "1.2 DBMSとバッファ", title: "メモリとHDDの速さの差", ref: "mem",
    prompt: "メモリとHDDのアクセス速度の差は、本書の大まかな見積もりでどれくらい？",
    choices: [
      { text: "数倍", ok: false, note: "差はもっと大きく、桁がいくつも違います。" },
      { text: "数十倍", ok: false, note: "数十倍から数百倍は、SSDとHDDの読み書き速度の差です。" },
      { text: "数百倍", ok: false, note: "メモリとHDDの差はさらに大きくなります。" },
      { text: "数十万〜百万倍", ok: true, note: "メモリとHDDの差は、大まかに数十万〜百万倍です。DBMSがデータの一部をメモリに置くのは、この差を埋めるためです。" },
    ],
    takeaway: "SQL文の実行時間の大半は、ストレージへのI/Oに使われます。<b>ストレージへのアクセスを減らせば速くなる。</b>",
  },
  {
    type: "q", sec: "1.2 DBMSとバッファ", title: "データキャッシュの効果", table: ["shops"], tableNote: SHOPS_NOTE, ref: "mem",
    prompt: "PostgreSQLを再起動した直後にShopsを全件読み、続けて同じSQLをもう一度実行した。2回目の実行計画で、Buffersの表示はどう変わった？",
    choices: [
      { text: "read=417がhit=417に変わった", ok: true, note: "1回目は共有バッファ（データキャッシュ）が空なので、417ページすべてをストレージ側から読みました（read）。2回目は同じページが共有バッファに残っていたので、すべてキャッシュから読みました（hit）。" },
      { text: "変わらなかった", ok: false, note: "1回目と2回目で、readとhitの内訳が入れ替わっています。" },
      { text: "2回目は1ページも読まなかった", ok: false, note: "結果を返すには、2回目も417ページを読む必要があります。読む場所がキャッシュに変わっただけです。" },
      { text: "2回目は倍の834ページを読んだ", ok: false, note: "読んだページ数は1回目と同じ417です。" },
    ],
    show: [{ q: "cache1", tag: "再起動直後（1回目）" }, { q: "cache2", tag: "2回目" }], showDefault: 1,
    takeaway: "<b>shared hitはキャッシュから、shared readはキャッシュの外から読んだページ数。</b>readには、OSのファイルキャッシュから読んだページも含まれます。",
  },
  {
    type: "q", sec: "1.2 DBMSとバッファ", title: "更新を必ずストレージに書くとき", ref: "mem",
    prompt: "UPDATE文を受け取ったDBMSは、更新情報をまずログバッファに溜める。ストレージ上のログファイルへ必ず書き込むのはいつ？",
    choices: [
      { text: "UPDATE文を実行した直後", ok: false, note: "実行直後はログバッファに溜めるだけです。ストレージに書くのを待つと、ユーザーを長く待たせてしまいます。" },
      { text: "コミットしたとき", ok: true, note: "コミットした時点で、更新情報をログファイルへ必ず書き込みます。メモリは電源が落ちると中身が消えるので、確定した更新を失わないためです。" },
      { text: "チェックポイントのとき", ok: false, note: "チェックポイントは、データキャッシュ上の更新済みのページをデータファイルへ書き出す処理です。コミットとは別に非同期で行います。" },
      { text: "DBMSを停止したとき", ok: false, note: "停止まで待つと、障害で落ちたときに更新が消えてしまいます。" },
    ],
    takeaway: "ログをデータファイルより先に書くので、この仕組みをWAL（Write-Ahead Log）と呼びます。<b>コミットはストレージへの同期処理なので、ここで待ちが発生しうる。</b>",
  },
  {
    type: "q", sec: "1.2 DBMSとバッファ", title: "ログバッファが小さい理由", ref: "mem",
    prompt: "多くのDBMSでは、ログバッファの初期値がデータキャッシュよりずっと小さい。その理由として本書が挙げているのはどれ？",
    choices: [
      { text: "データベースは検索を主な処理と想定しているから", ok: true, note: "検索は数千万件を対象にすることも珍しくありませんが、更新はトランザクションあたり多くても数万件です。限られたメモリを、検索でヒットしそうなデータのキャッシュに多く割り当てています。" },
      { text: "ログは圧縮して保存するから", ok: false, note: "本書が挙げている理由は、検索と更新のどちらを重視するかです。" },
      { text: "ログはメモリを通さずに直接ディスクへ書くから", ok: false, note: "ログもいったんログバッファに溜めてから書き込みます。" },
      { text: "更新処理は遅くても問題にならないから", ok: false, note: "更新が多いシステムでは、ログバッファを大きくするチューニングが必要になることもあります。" },
    ],
    takeaway: "このドリルで使ったDBの初期値は、PostgreSQL 16がshared_buffers=128MBとwal_buffers=4MBでした。MySQL 8.0はinnodb_buffer_pool_size=128MBとinnodb_log_buffer_size=16MBでした。<b>どちらに多く割り当てているかで、DBが何を重視しているかがわかる。</b>",
  },
  {
    type: "q", sec: "1.2 DBMSとバッファ", title: "ソートがメモリに収まらないと", table: ["shops"], tableNote: SHOPS_NOTE, ref: "mem",
    prompt: "Shopsの50,000行を店舗名で並べ替える。PostgreSQL 16の既定のwork_mem（4MB）で実行すると、実行計画のSort Methodは何になった？",
    choices: [
      { text: "quicksort（Memory）", ok: false, note: "メモリだけでソートできたのは、work_memを16MBに増やしたときです。" },
      { text: "external merge（Disk）", ok: true, note: "4MBに収まらなかったので、ディスク上の一時ファイルを使ってソートしました（Disk: 2160kB）。いわゆるTEMP落ちです。Buffersにもtemp read / writtenが出ています。" },
      { text: "メモリ不足でエラーになった", ok: false, note: "DBMSは、メモリが足りなくてもエラーにせず、遅くなっても処理を続けようとします。" },
      { text: "インデックスを使ってソートを省いた", ok: false, note: "shop_nameにはインデックスがないので、Sortノードが必要です。" },
    ],
    show: [{ q: "sort_4mb", tag: "work_mem = 4MB（既定）" }, { q: "sort_16mb", tag: "work_mem = 16MB" }],
    takeaway: "<b>ワーキングメモリが溢れると、ある量を境に急に遅くなる。</b>MySQLのEXPLAINには、ソートがメモリに収まったかどうかは出ません。",
  },
  {
    type: "q", sec: "1.3 DBMSと実行計画", title: "統計情報を管理するのは", ref: "arch",
    prompt: "テーブルの行数や列の値の分布といった統計情報を管理し、オプティマイザに渡すのはどれ？",
    choices: [
      { text: "パーサ", ok: false, note: "パーサはSQL文を構文解析し、書き方の誤りがないかを調べます。" },
      { text: "プラン評価", ok: false, note: "プラン評価は、オプティマイザが作った実行計画を受け取り、実行するものを選びます。" },
      { text: "カタログマネージャ", ok: true, note: "カタログマネージャはテーブルやインデックスの統計情報を管理し、オプティマイザが実行計画を立てるときに渡します。" },
      { text: "バッファマネージャ", ok: false, note: "バッファマネージャは、メモリ上のバッファにどのデータを載せるかを管理します。" },
    ],
    takeaway: "<b>オプティマイザは、カタログの統計情報をもとに実行計画を立てる。</b>統計情報が古いと、実行計画も的外れになります。",
  },
  {
    type: "q", sec: "1.3 DBMSと実行計画", title: "古い統計情報のまま実行すると", table: ["shops"], tableNote: "このテーブルは、50,000行を入れて統計情報を取ったあと、全行をDELETEしてコミットしました。自動で統計情報を更新する機能（autovacuum）は止めています。", ref: "stats",
    prompt: "全行を削除したShopsに対して、統計情報を更新する前にPostgreSQLでEXPLAIN ANALYZEを実行した。推定行数（rows=）と実際の行数（actual rows=）はどうなった？",
    choices: [
      { text: "推定0行、実際0行", ok: false, note: "推定行数は統計情報から計算するので、削除したことを知りません。" },
      { text: "推定50,000行、実際0行", ok: true, note: "オプティマイザは統計情報だけを見て、まだ50,000行あると推定しました。実際に読むと0行です。ANALYZEで統計情報を更新すると、推定は1行に変わります。" },
      { text: "推定50,000行、実際50,000行", ok: false, note: "コミット済みなので、実際に返る行は0行です。" },
      { text: "統計情報が古いのでエラーになった", ok: false, note: "統計情報が古くてもエラーにはなりません。古い情報のまま実行計画を立てます。" },
    ],
    show: [{ q: "stale1_before", tag: "ANALYZE前" }, { q: "stale2_after", tag: "ANALYZE後" }],
    takeaway: "MySQL 8.0は、ANALYZE前でも推定100行と、PostgreSQLほど古い値に引きずられませんでした。<b>大量の更新のあとは、統計情報もあわせて更新する。</b>",
  },
  {
    type: "q", sec: "1.4 実行計画がSQL文のパフォーマンスを決める", title: "どのDBMSにも出る項目", ref: "plan",
    prompt: "Oracle、PostgreSQL、MySQLの実行計画に共通して出る3つの項目に、含まれないのはどれ？",
    choices: [
      { text: "操作対象のオブジェクト", ok: false, note: "共通して出ます。PostgreSQLとMySQLはonのあと、OracleはName列に出ます。" },
      { text: "オブジェクトに対する操作の種類", ok: false, note: "共通して出ます。実行計画で最も重要な項目です（Seq Scan、Index Scanなど）。" },
      { text: "操作の対象となるレコード数", ok: false, note: "共通して出ます（rows=、Rows列）。ただし統計情報からの推定値です。" },
      { text: "実際にかかった時間", ok: true, note: "EXPLAINが出すのは推定値です。実際の時間や行数は、PostgreSQLのEXPLAIN ANALYZEやOracleのDBMS_XPLAN.DISPLAY_CURSORのように、SQLを実際に実行して取ります。" },
    ],
    takeaway: "Costも出ますが、値の大小で実行時間を絶対評価することはできません。<b>まず、何に対してどんな操作を何行分しているかを読む。</b>",
  },
  {
    type: "q", sec: "1.4 実行計画がSQL文のパフォーマンスを決める", title: "インデックスがあっても全件読むとき", table: ["shops"], tableNote: SHOPS_NOTE, ref: "plan",
    prompt: "Shopsの主キーshop_idにはインデックスがある。shop_idで絞り込む次の3つのうち、PostgreSQLがインデックスを使わずにSeq Scanを選んだのはどれ？",
    choices: [
      { q: "pk", tag: "1行を指定", ok: false, note: "1行だけを探すので、Index Scanで3ページ読むだけで済みました。" },
      { q: "range_narrow", tag: "11行の範囲", ok: false, note: "11行の範囲なので、Index Scanを使いました。" },
      { q: "range_wide", tag: "49,991行の範囲", ok: true, note: "条件に合うのは50,000行中49,991行で、ほぼ全件です。インデックスで1行ずつ探すより、テーブルを順に全部読むほうが安いと判断しました。" },
    ],
    takeaway: "MySQLは同じ条件でも主キーの範囲検索を選びました。InnoDBはテーブルを主キーの順に格納しているので、実質的にはテーブルを順に読むのと同じです。<b>インデックスが速いのは、選ぶ行が少ないとき。</b>",
  },
  {
    type: "q", sec: "1.4 実行計画がSQL文のパフォーマンスを決める", title: "結合で先に読むテーブル", table: ["shops", "reservations"], tableNote: SHOPS_NOTE, ref: "plan",
    prompt: "予約のある店舗の名前を、ShopsとReservationsの結合で取り出す。MySQL 8.0の実行計画で、最初にアクセスされるテーブル（駆動表）はどれ？",
    choices: [
      { text: "Reservations", ok: true, note: "Nested loop inner joinの下で、Table scan on Rが上に書かれています。同じ深さなら上の操作が先なので、Reservationsを読み、その1行ごとにShopsを主キーで探しています。" },
      { text: "Shops", ok: false, note: "Shopsは、Reservationsの各行に対して主キーで1行ずつ探されています（loops=10）。" },
      { text: "2つを同時に読む", ok: false, note: "Nested Loopsは、片方を読んでからもう片方を探す二重ループです。" },
      { text: "実行するまで決まらない", ok: false, note: "実行計画の段階で、どちらを先に読むかは決まっています。" },
    ],
    show: [{ q: "join", tag: "結合" }], db: "my",
    takeaway: "PostgreSQLは、本書の例にあるNested Loopの代わりにMerge Joinを選びました。結合アルゴリズムは環境によって変わります。<b>インデントの深い操作から先に実行し、同じ深さなら上から実行する。</b>",
  },
  {
    type: "q", sec: "1.5 実行計画の重要性", title: "実行計画を人が変える手段", ref: "stats",
    prompt: "オプティマイザの選んだ実行計画がよくないとき、SQLの結果を変えずにアクセス方法だけを指示する手段はどれ？",
    choices: [
      { text: "ヒント句", ok: true, note: "ヒント句はSQL文に埋め込んで、オプティマイザに使う手順を指示します。結果は変わらず、アクセスパスだけが変わります。" },
      { text: "ビュー", ok: false, note: "ビューはSELECT文を保存する機能で、実行計画を指示するものではありません。" },
      { text: "トリガー", ok: false, note: "トリガーは、更新などをきっかけに処理を自動で実行する機能です。" },
      { text: "CHECK制約", ok: false, note: "CHECK制約は、列に入る値の条件を決める機能です。" },
    ],
    takeaway: "OracleのSPMやAurora PostgreSQLのQPMのように、実行計画を固定する機能を持つDBMSもあります。<b>チューニングは、まず今の実行計画を確かめることから。</b>",
  },
  {
    type: "q", sec: "演習問題1", title: "データキャッシュに残すデータの選び方", ref: "mem",
    prompt: "データキャッシュは限られたメモリに収まるだけのデータしか持てない。新しいデータを載せるために追い出すデータを選ぶルールとして、よく使われる考え方はどれ？",
    choices: [
      { text: "最後に使われてから最も時間がたったデータを追い出す（LRU）", ok: true, note: "最近使われたデータほど、またすぐ使われやすいと考えます。PostgreSQLは使用回数を数えながら巡回するクロックスイープ、MySQLのInnoDBはLRUを改良したアルゴリズムを使っています。" },
      { text: "最初に載せたデータから順に追い出す（FIFO）", ok: false, note: "よく使うデータでも古いだけで追い出してしまい、効率が落ちます。" },
      { text: "ランダムに選んで追い出す", ok: false, note: "使われ方を考慮しないので、よく使うデータも追い出されます。" },
      { text: "サイズの大きいデータから追い出す", ok: false, note: "サイズとまた使われるかどうかは関係しません。" },
    ],
    takeaway: "InnoDBは、新しく読んだページをリストの途中（末尾から37%の位置）に入れます（innodb_old_blocks_pct=37）。1回きりの全件走査で、よく使うページが追い出されないようにするためです。<b>自分の使うDBMSのマニュアルで確かめる。</b>",
  },
  { type: "end" },
];

const INTRO_BODY = {
  arch: () => `<div class="grid">
      <div class="col">
        <p class="prompt">DBMS（データベース管理システム）は、受け取ったSQL文を処理して、ストレージのデータを読み書きするソフトウェアです。中はいくつかの部品に分かれています。</p>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>部品</th><th>役割</th></tr></thead>
          <tbody>
            <tr><td>クエリ評価エンジン</td><td>SQLを解釈し、実行計画を立てて実行する</td></tr>
            <tr><td>バッファマネージャ</td><td>メモリ上のバッファにどのデータを置くかを管理する</td></tr>
            <tr><td>ディスク容量マネージャ</td><td>どこに何を保存するかを管理し、読み書きを制御する</td></tr>
            <tr><td>トランザクション・ロックマネージャ</td><td>同時に動く処理の整合性を保つ</td></tr>
            <tr><td>リカバリマネージャ</td><td>バックアップを取り、障害時にデータを復旧する</td></tr>
          </tbody></table></div>
      </div>
      <div class="col">
        <div class="label">SQLを受け取ってから実行するまで</div>
        <div class="row">${["パーサ", "オプティマイザ", "プラン評価", "実行"].map(w => `<span class="chip pages">${w}</span>`).join("<span class=\"hint\">→</span>")}</div>
        <ul class="points">
          <li>パーサはSQL文を構文解析し、書き方の誤りや存在しないテーブル名がないかを調べます。</li>
          <li>オプティマイザは実行計画の候補を作り、それぞれのコストを見積もります。見積もりには、カタログマネージャが管理する統計情報を使います。</li>
          <li>プラン評価で実行計画を1つに決め、DBMSが手続きに変換して実行します。</li>
        </ul>
        <p class="takeaway">SQLには「何が欲しいか」だけを書き、「どう取るか」はDBMSが決めます。<b>性能を考えるときは、DBMSが決めた手順（実行計画）をのぞく必要がある。</b></p>
      </div>
    </div>`,
  mem: () => `<div class="grid">
      <div class="col">
        <p class="prompt">メモリは速いけれど高価で容量が少なく、電源が落ちると中身が消えます。ストレージは遅いけれど安く大容量で、データが消えません。DBMSはこのトレードオフの中で、メモリを3つの用途に分けて使います。</p>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>メモリ領域</th><th>PostgreSQL 16</th><th>MySQL 8.0</th></tr></thead>
          <tbody>
            <tr><td>データキャッシュ</td><td>shared_buffers<br>128MB</td><td>innodb_buffer_pool_size<br>128MB</td></tr>
            <tr><td>ログバッファ</td><td>wal_buffers<br>4MB</td><td>innodb_log_buffer_size<br>16MB</td></tr>
            <tr><td>ワーキングメモリ</td><td>work_mem<br>4MB</td><td>sort_buffer_size<br>256KB</td></tr>
          </tbody></table></div>
        <p class="hint">値はこのドリルで使ったDBの初期値です。</p>
      </div>
      <div class="col">
        <ul class="points">
          <li><b>データキャッシュ</b>：ストレージのデータの一部を置きます。欲しいデータがここにあれば、ストレージを読まずに済みます。</li>
          <li><b>ログバッファ</b>：更新の情報をいったん溜めます。コミットした時点でログファイルへ必ず書き込みます（WAL）。データファイルへの反映は、あとでチェックポイントとしてまとめて行います。</li>
          <li><b>ワーキングメモリ</b>：ソートやハッシュに使う作業領域です。足りなくなるとストレージ上の一時領域を使い（TEMP落ち）、急に遅くなります。</li>
        </ul>
        <p class="takeaway">データベースは検索を主な処理と想定しているので、<b>データキャッシュに多くのメモリを割り当てている。</b></p>
      </div>
    </div>`,
  plan: () => {
    const r = analyze(D.join.my, "my");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">実行計画は、SQLの前にEXPLAINを付けて表示します。PostgreSQLは<code>EXPLAIN</code>、MySQLは<code>EXPLAIN FORMAT=TREE</code>です。ANALYZEを付けると実際に実行し、実際の行数や時間も出します。</p>
        <div class="label">どのDBMSにも出る3つの項目</div>
        <ol class="points">
          <li>操作対象のオブジェクト（テーブルやインデックス）</li>
          <li>操作の種類（全件を読むSeq ScanやTable scan、インデックスで探すIndex Scanなど）</li>
          <li>操作の対象となるレコード数（rows=。統計情報からの推定値）</li>
        </ol>
        <div class="label">読む順番</div>
        <ul class="points">
          <li>インデントが深い操作ほど先に実行します。</li>
          <li>同じ深さなら、上に書かれた操作が先です。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">例：予約のある店舗の名前を取る</div>
        ${pre(D.join.sql)}
        <div class="label">MySQL 8.0の実行計画</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>最も深い2行のうち、上のTable scan on Rが先です。Reservationsを全件読みます。</li>
          <li>Reservationsの1行ごとに、Shopsを主キーで1行ずつ探します（loops=10）。</li>
          <li>Nested loop inner joinが2つを組み合わせて結果を返します。</li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
  stats: () => `<div class="grid">
      <div class="col">
        <p class="prompt">オプティマイザは、カタログに保存された統計情報をもとに実行計画を立てます。実際のテーブルを数えているわけではありません。</p>
        <div class="label">統計情報の例</div>
        <ul class="points">
          <li>テーブルの行数、列の数とサイズ</li>
          <li>列の値の種類の数（カーディナリティ）と分布（ヒストグラム）</li>
          <li>列のNULLの数、インデックスの情報</li>
        </ul>
        <div class="label">統計情報を更新するコマンド</div>
        ${pre("ANALYZE テーブル名;        -- PostgreSQL\nANALYZE TABLE テーブル名;  -- MySQL")}
      </div>
      <div class="col">
        <ul class="points">
          <li>大量の行を入れたり消したりしたのに統計情報を更新しないと、オプティマイザは古い情報で実行計画を立てます。ゴミを入れればゴミが出てくる（Garbage In, Garbage Out）状態です。</li>
          <li>統計情報の更新は、大きなテーブルでは数十分以上かかることもあります。バッチ処理の流れに組み込むなど、更新のタイミングを決めておきます。</li>
          <li>オプティマイザが最適でない計画を選んだときは、ヒント句で手順を指示できます。結果は変わらず、アクセス方法だけが変わります。</li>
        </ul>
        <p class="takeaway"><b>実行計画のrows=は推定値。</b>EXPLAIN ANALYZEで実際の行数と並べると、統計情報のずれに気づけます。</p>
      </div>
    </div>`,
};

const CH = {
  no: 1,
  store: "sql-jissen-ch1-drill",
  h1: "DBMSのアーキテクチャ<br>この世にただ飯はあるか",
  lede: () => `メモリとストレージ、統計情報、実行計画の読み方を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画が表示されます。`,
  points: [
    "データベースは、さまざまなトレードオフのバランスを取るソフトウェア。",
    "性能の面では、データを低速なストレージと高速なメモリのどちらに置くかのトレードオフが重要。",
    "データベースは更新より検索を重視した設計と初期設定になっている。それが自分のシステムに合うかは判断が要る。",
    "データベースは、SQLを実行可能な手続きへ変換するため、実行計画を作っている。",
  ],
};
