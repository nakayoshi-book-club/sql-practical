const T = {
  items: { name: "Items（商品）", cols: ["item_id", "year", "item_name", "price_tax_ex", "price_tax_in"], rows: [
    [100,2000,"カップ",500,525],[100,2001,"カップ",520,546],[100,2002,"カップ",600,630],[100,2003,"カップ",600,630],
    [101,2000,"スプーン",500,525],[101,2001,"スプーン",500,525],[101,2002,"スプーン",500,525],[101,2003,"スプーン",500,525],
    [102,2000,"ナイフ",600,630],[102,2001,"ナイフ",550,577],[102,2002,"ナイフ",550,577],[102,2003,"ナイフ",400,420]] },
  population: { name: "Population（人口）", cols: ["prefecture", "sex", "pop"], rows: [
    ["徳島","1",60],["徳島","2",40],["香川","1",90],["香川","2",100],["愛媛","1",100],
    ["愛媛","2",50],["高知","1",100],["高知","2",100],["福岡","1",20],["福岡","2",200]] },
  customers: { name: "CustomerCount（来客数）", cols: ["record_date", "dow", "customers"], rows: [
    ["2024-11-12","Mon",212],["2024-11-13","Tue",540],["2024-11-14","Wed",145],["2024-11-15","Thr",321],
    ["2024-11-16","Fri",670],["2024-11-17","Sat",518],["2024-11-18","Sun",420],["2024-11-19","Mon",376],
    ["2024-11-20","Tue",222],["2024-11-21","Wed",518],["2024-11-22","Thr",842],["2024-11-23","Fri",632],
    ["2024-11-24","Sat",190],["2024-11-25","Sun",341]] },
  employees: { name: "Employees（社員）", cols: ["emp_id", "team_id", "emp_name", "team"], rows: [
    [201,1,"Joe","商品企画"],[201,2,"Joe","開発"],[201,3,"Joe","営業"],[202,2,"Jim","開発"],[203,3,"Carl","営業"],
    [204,1,"Bree","商品企画"],[204,2,"Bree","開発"],[204,3,"Bree","営業"],[204,4,"Bree","管理"],
    [205,1,"Kim","商品企画"],[205,2,"Kim","開発"]] },
  three: { name: "ThreeElements", cols: ["key_col", "name", "date_1", "flg_1", "date_2", "flg_2", "date_3", "flg_3"], rows: [
    [1,"a","2013-11-01","T",null,null,null,null],[2,"b",null,null,"2013-11-01","T",null,null],
    [3,"c",null,null,"2013-11-01","F",null,null],[4,"d",null,null,"2013-12-30","T",null,null],
    [5,"e",null,null,null,null,"2013-11-01","T"],[6,"f",null,null,null,null,"2013-12-01","F"]] },
};
T.threeG = { ...T.three, name: "ThreeElements（gを追加）", rows: [...T.three.rows, [7,"g","2013-11-01","F",null,null,"2013-11-01","T"]], mark: 6 };

const THREE_NOTE = "このほかに測定用のダミー行を300,000行入れています（日付は2000〜2009年で、2013-11-01には一致しません）。インデックスはIDX_1 (date_1, flg_1)、IDX_2 (date_2, flg_2)、IDX_3 (date_3, flg_3)。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "plan", title: "実行計画の読み方" },
  { type: "intro", id: "syntax", title: "CASE式とUNION" },
  { type: "intro", id: "branch", title: "文で分岐するか、式で分岐するか" },
  { type: "intro", id: "agg", title: "集約やインデックスと組み合わせる" },
  {
    type: "q", sec: "3.1 UNIONを使った冗長な表現", title: "税抜と税込を年で切り替える", ref: "branch", table: ["items"],
    prompt: "2001年までは税抜価格、2002年からは税込価格をprice列として出したい。正しい結果を返し、Itemsへのアクセスが1回で済むのはどれ？",
    choices: [
      { q: "items_union_all", tag: "UNION ALL", ok: false, note: "結果は正しいですが、Itemsを2回走査します。実行計画ではAppendの下にSeq Scanが2本並びます。" },
      { q: "items_case", tag: "CASE式", ok: true, note: "SELECT句のCASE式で列を切り替えるので、Itemsの走査は1回。読んだページ数もUNION ALLの半分です。" },
      { q: "items_where", tag: "WHEREのOR", ok: false, note: "WHERE句は行を絞り込むだけで、出す列は切り替えられません。結果タブを見ると、2002年以降も税抜価格（カップ2002年 = 600）が出ています。" },
    ],
    takeaway: "<b>WHERE句で条件分岐させるのは素人、プロはSELECT句で分岐させる。</b>実行計画で走査の本数を数えると差がはっきりします。",
  },
  {
    type: "q", sec: "3.1 UNIONを使った冗長な表現", title: "UNIONとUNION ALL", ref: "syntax", table: ["items"],
    prompt: "前の問題のUNION ALLをUNIONに書き換えると、PostgreSQLの実行計画にはどのノードが増える？",
    choices: [
      { text: "Index Scan", ok: false, note: "インデックスは関係しません。どちらもSeq Scanのままです。" },
      { text: "HashAggregate（重複行の除去）", ok: true, note: "UNIONは重複行を取り除くため、Appendの上にHashAggregateが載ります。MySQLでもAppendが「Union materialize with deduplication」に変わります。" },
      { text: "Nested Loop", ok: false, note: "結合は発生しません。UNIONは結果を縦に積むだけです。" },
      { text: "何も変わらない", ok: false, note: "UNIONとUNION ALLの違いは重複除去の有無です。その分の処理が計画に現れます。" },
    ],
    show: [{ q: "items_union_all", tag: "UNION ALL" }, { q: "items_union", tag: "UNION" }], showDefault: 1,
    takeaway: "2つのWHERE条件（<code>year &lt;= 2001</code>と<code>year &gt;= 2002</code>）は重ならないので、重複除去は無駄な処理です。<b>条件が排他的ならUNION ALLを使う。</b>",
  },
  {
    type: "q", sec: "3.2 集計における条件分岐", title: "男女の人口を1行に並べる", ref: "agg", table: ["population"],
    prompt: "県ごとに男性（sex = '1'）と女性（sex = '2'）の人口を1行に並べたい。Populationの走査が1回で済むのはどれ？",
    choices: [
      { q: "pop_union", tag: "UNION + GROUP BY", ok: false, note: "WHEREで性別を分けてUNIONで積むので、走査は2回。さらにUNIONの重複除去と外側のGROUP BYでHashAggregateが2段重なります。" },
      { q: "pop_join", tag: "自己結合", ok: false, note: "自己結合もテーブルを2回参照します。MySQLはW側を主キーで1行ずつ引きますが、それでもPopulationを2回参照しています。" },
      { q: "pop_case", tag: "SUM(CASE ...)", ok: true, note: "集約関数の中にCASE式を入れると、1回の走査で男女の列を作れます。MySQLは主キーのインデックスを順に読み、そのままGROUP BYしています。" },
    ],
    takeaway: "<b>集計の条件分岐もCASE式で書く。</b>表側と表頭を入れ替えるピボットの定番です。",
  },
  {
    type: "q", sec: "3.2 集計における条件分岐", title: "曜日を列に並べる", ref: "agg", table: ["customers"],
    prompt: "日付ごとの来客数を、曜日を列にして集計したい（ここでは月・火・土・日の4列）。1つだけ誤った数値を返すクエリがある。どれ？",
    choices: [
      { q: "cc_sum0", tag: "SUM ... ELSE 0", ok: false, note: "正しい値です（月588、火762、土708、日761）。" },
      { q: "cc_sumnull", tag: "SUM（ELSEなし）", ok: false, note: "ELSEを省略するとELSE NULLと同じです。SUMはNULLを無視するので、ELSE 0と同じ値になります。" },
      { q: "cc_count0", tag: "COUNT ... ELSE 0", ok: true, note: "COUNTはNULL以外の値を数える関数です。ELSE 0の0も1件として数えるため、全列が全行数の14になりました。件数を数えたいときは、ELSEを省略してNULLを返します。" },
      { q: "cc_where", tag: "WHERE + GROUP BY", ok: false, note: "曜日が行に並ぶ縦持ちの結果です。列に並べる要件は満たしていませんが、各曜日の合計は正しく出ています。" },
    ],
    takeaway: "どのクエリも走査は1回で、実行計画では区別できません。<b>集約関数がNULLをどう扱うかは、結果を見て確かめる。</b>",
  },
  {
    type: "q", sec: "3.2 集計における条件分岐", title: "兼務の数で表示を変える", ref: "agg", table: ["employees"],
    prompt: "所属チームが1つの社員はチーム名、2つなら「2つを兼務」、3つ以上なら「3つ以上を兼務」と表示したい。エラーにならず、Employeesの走査が1回で済むのはどれ？",
    choices: [
      { q: "emp_union", tag: "HAVING + UNION", ok: false, note: "結果は正しいですが、走査とGROUP BYを3回ずつ実行し、最後に重複除去も行います。" },
      { q: "emp_case_team", tag: "CASE（teamをそのまま）", ok: false, note: "エラーです。GROUP BY emp_nameで1行にまとめた後では、teamの値は1つに決まりません。MAX(team)のように集約関数で取り出します。" },
      { q: "emp_where", tag: "WHERE COUNT(*)", ok: false, note: "エラーです。WHERE句は集約より前に評価されるので、COUNT(*)は書けません。" },
      { q: "emp_case", tag: "CASE（COUNT(*)で分岐）", ok: true, note: "COUNT(*)の戻り値をCASE式の入力にしています。集約関数の結果は1行につき1つのスカラ値なので、CASE式で分岐できます。走査と集約はどちらも1回です。" },
    ],
    takeaway: "分岐の条件が件数になっても、考え方は同じです。<b>HAVING句で条件分岐させるのも素人。</b>",
  },
  {
    type: "q", sec: "3.3 それでもUNIONが必要なのです", title: "UNIONが本当に必要な場面", ref: "agg",
    prompt: "CASE式に書き換えられず、UNIONを使うしかないのはどれ？",
    choices: [
      { text: "年によって、表示する価格の列を切り替える", ok: false, note: "SELECT句のCASE式で書けます（最初の問題）。" },
      { text: "性別ごとの値を列に展開する", ok: false, note: "SUM(CASE ...)で書けます（3問目）。" },
      { text: "異なるテーブルから取った結果を1つにまとめる", ok: true, note: "SELECTごとにFROMのテーブルが違う場合は、CASE式では書けません。結合で1つのSELECT文にまとめると、本来は不要な結合のコストがかかります。" },
      { text: "集約した件数によって表示を変える", ok: false, note: "COUNT(*)をCASE式の入力にすれば書けます（前の問題）。" },
    ],
    takeaway: "例：<code>SELECT col_1 FROM Table_A WHERE col_2 = 'A' UNION ALL SELECT col_3 FROM Table_B WHERE col_4 = 'B'</code>",
  },
  {
    type: "q", sec: "3.3 それでもUNIONが必要なのです", title: "ORはインデックスを使えないのか", ref: "agg", table: ["three"], tableNote: THREE_NOTE,
    prompt: "date_nが2013-11-01で、対になるflg_nが'T'の行を探す。本書のOracleの例では、ORで書くとフルスキャンになりUNIONが有利だった。ではPostgreSQL 16でOR版を実行すると、計画はどうなった？",
    choices: [
      { text: "テーブルのフルスキャン", ok: false, note: "フルスキャンになったのはCASE式版だけでした（1,622ページ）。" },
      { text: "3本のインデックスをBitmapOrで合成し、テーブルは1回だけ読む", ok: true, note: "条件ごとにBitmap Index Scanを行い、ビットマップをORで合成してからテーブルを読みます。読んだページ数はUNIONの9に対して7です。" },
      { text: "IDX_1だけを使い、残りの条件は後からフィルタする", ok: false, note: "3本とも使われています。計画の青い行を見てください。" },
      { text: "UNIONと同じく、テーブルを3回読む", ok: false, note: "それはUNION版の計画です。OR版のBitmap Heap Scanは1本だけです。" },
    ],
    show: [{ q: "te_union", tag: "UNION" }, { q: "te_or", tag: "OR" }, { q: "te_in", tag: "IN（行式）" }, { q: "te_case", tag: "CASE式" }], showDefault: 1,
    takeaway: "本書の注にあるとおり、ORをUNIONと同じように実行するDBMSもあります。<b>どちらが速いかは、使うDBMSの実行計画で確かめる。</b>",
  },
  {
    type: "q", sec: "3.3 それでもUNIONが必要なのです", title: "MySQLで行式のINを使うと", ref: "plan", table: ["three"], tableNote: THREE_NOTE,
    prompt: "MySQL 8.0では、OR版はインデックスマージ（3本のインデックスを範囲検索して行IDで重複を除く）になった。では、意味が同じ行式のIN版はどうなった？",
    choices: [
      { text: "OR版と同じくインデックスマージ", ok: false, note: "PostgreSQLはINをORに展開してBitmapOrにしましたが、MySQLはそうしませんでした。" },
      { text: "テーブルのフルスキャン", ok: true, note: "MySQLは行式のINをインデックス検索に変換できず、約30万行をすべて読んでフィルタしています。" },
      { text: "IDX_1だけを使う", ok: false, note: "インデックスは1本も使われていません。" },
      { text: "構文エラー", ok: false, note: "MySQL 8.0は行式（row constructor）のINをサポートしています。結果も正しく返ります。" },
    ],
    show: [{ q: "te_union", tag: "UNION" }, { q: "te_or", tag: "OR" }, { q: "te_in", tag: "IN（行式）" }, { q: "te_case", tag: "CASE式" }], showDefault: 2, db: "my",
    takeaway: "INとORは同じ意味でも、オプティマイザが同じ計画にするとは限りません。<b>書き換えたら、計画も見直す。</b>",
  },
  {
    type: "q", sec: "演習問題3", title: "同じ結果を返さなくなるクエリ", ref: "syntax", table: ["threeG"], res: "resg",
    prompt: "「(date_n, flg_n)のペアのうち値を持つのは1つだけ」という前提を外し、次の行gを追加する。UNION・OR・IN・CASE式のうち、他と違う結果を返すのはどれ？",
    code: "INSERT INTO ThreeElements\nVALUES (7, 'g', '2013-11-01', 'F', NULL, NULL, '2013-11-01', 'T');",
    choices: [
      { q: "te_union", tag: "UNION", ok: false, note: "3つ目のSELECT（date_3とflg_3の条件）でgが返ります。" },
      { q: "te_or", tag: "OR", ok: false, note: "3つ目の条件が真になるので、gは残ります。" },
      { q: "te_in", tag: "IN（行式）", ok: false, note: "('2013-11-01', 'T')が(date_3, flg_3)と一致するので、gは残ります。" },
      { q: "te_case", tag: "CASE式", ok: true, note: "gだけ返りません。CASE式は上のWHENから順に評価し、最初に真になった分岐で止まるからです。次のスライドで1ステップずつ追います。" },
    ],
    takeaway: "結果タブでa・b・e・gが返るか比べてみてください。",
  },
  { type: "custom", render: () => renderSteps() },
  { type: "custom", render: () => renderAnswer() },
  {
    type: "q", sec: "3.4 手続き型と宣言型", title: "SQLの各句に書くもの", ref: "branch",
    prompt: "SELECT・FROM・WHERE・GROUP BY・HAVING・ORDER BYの各句に書くものは、手続き型言語の用語でいうと何？",
    choices: [
      { text: "文（statement）", ok: false, note: "UNIONで連結する対象はSELECT「文」ですが、各句の中に文は書きません。" },
      { text: "式（expression）", ok: true, note: "各句に書くのはすべて式です。列名だけでも、定数だけでも式です。" },
      { text: "手続き（procedure）", ok: false, note: "SQL文の中に手続きは書きません。" },
      { text: "ブロック", ok: false, note: "SQLの句はブロック構造を持ちません。" },
    ],
    takeaway: "手続き型の言語でIF文を書く箇所には、SQLでは<b>CASE式</b>を書く。",
  },
  { type: "end" },
];

const STEPS = {
  caseLane: [
    ["WHEN date_1 = '2013-11-01'", `<span class="t">真</span>（gのdate_1は2013-11-01）`],
    ["THEN flg_1", `'F'を返してCASE式はここで終わる`],
    ["WHEN date_2 … / WHEN date_3 …", `<span class="n">評価されない</span>`],
    ["'F' = 'T'", `<span class="f">偽</span> → gは除外される`],
  ],
  orLane: [
    ["date_1 = '2013-11-01' AND flg_1 = 'T'", `<span class="t">真</span> AND <span class="f">偽</span> → <span class="f">偽</span>`],
    ["date_2 = '2013-11-01' AND flg_2 = 'T'", `NULL AND NULL → <span class="n">NULL</span>`],
    ["date_3 = '2013-11-01' AND flg_3 = 'T'", `<span class="t">真</span> AND <span class="t">真</span> → <span class="t">真</span>`],
    ["偽 OR NULL OR 真", `<span class="t">真</span> → gは残る`],
  ],
};
let step = 0;
function renderSteps() {
  const n = step;
  const lane = (title, rows, isCase) => `<div class="lane"><h3>${title}</h3>${rows.map(([c, out], k) => {
    let cls = "step";
    if (k >= n) cls += " pending";
    else if (k === n - 1) cls += " now";
    if (isCase && k === 2 && k < n) cls += " skip";
    return `<div class="${cls}"><code>${esc(c)}</code><span class="out">${out}</span></div>`;
  }).join("")}</div>`;
  return `<div class="head"><span class="eyebrow">演習問題3の解説</span></div>
    <h2>行gを1ステップずつ評価する</h2>
    <p class="prompt">行gでは、date_1とdate_3がどちらも2013-11-01です。フラグの値はflg_1 = 'F'、flg_3 = 'T'です。この行をCASE式版とOR版のWHERE条件がどう評価するかを並べます。</p>
    ${renderTable("threeG").replace(/<tr class="">.*?<\/tr>/gs, "")}
    <div class="row"><button type="button" class="big-btn" id="stepNext">${n >= 4 ? "最初から" : n === 0 ? "評価を始める" : "次のステップ"}</button><span class="hint">ステップ${n} / 4</span></div>
    <div class="steps">${lane("CASE式版", STEPS.caseLane, true)}${lane("OR版（UNION・INも同じ判定）", STEPS.orLane, false)}</div>`;
}

function renderAnswer() {
  return `<div class="head"><span class="eyebrow">演習問題3の解説</span></div>
    <h2>同値性が崩れるのはどんなときか</h2>
    <div class="grid">
      <div class="col">
        <p class="prompt">複数のペアが同じ日付を持ち、<b>先に評価されるペアのフラグが'T'でなく、後ろのペアのフラグが'T'</b>のとき、CASE式版だけがその行を返しません。CASE式は最初に真になったWHENで止まり、後ろのペアを見ないからです。</p>
        <p class="prompt">UNION・OR・INはどのペアについても独立に条件を判定するので、どれか1つのペアが一致すれば行を返します。</p>
        <p class="takeaway">発展：UNIONをUNION ALLに変えると、条件を満たすペアを2つ持つ行は2回返ります。たとえばdate_1とdate_3が2013-11-01で、flg_1とflg_3がどちらも'T'の行です。UNIONは重複を取り除くので、この行は1回だけ返ります。</p>
      </div>
      <div class="col">
        <div class="label">CASE式版のWHERE条件</div>
        <pre>${esc(D.te_case.sql.split("WHERE")[1].trim().replace(/^/, "WHERE "))}</pre>
        <p class="hint">前提（値を持つペアは1つだけ）が守られている間は、どのWHENが真になっても対になるフラグを見るので、4つのクエリは同じ結果を返します。</p>
      </div>
    </div>`;
}


const INTRO_BODY = {
  plan: () => {
    const r = analyze(D.cc_where.pg, "pg");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">SQLには欲しいデータの条件だけを書きます。データをどの順にどう読むかはDBMSのオプティマイザが決め、その手順を実行計画と呼びます。SQLの先頭にEXPLAINを付けて実行すると、実行計画を表示できます。</p>
        <p class="prompt">実行計画は木の形をしています。インデントの深い行から先に実行し、その結果を1つ上の行に渡します。</p>
        <div class="label">よく出てくるノード</div>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>意味</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
          <tbody>
            <tr><td>テーブルを全件読む</td><td>Seq Scan</td><td>Table scan</td></tr>
            <tr><td>インデックスで探す</td><td>Index Scan<br>Bitmap Index Scan</td><td>Index lookup<br>Index range scan</td></tr>
            <tr><td>結果を縦に積む</td><td>Append</td><td>Append<br>Union materialize</td></tr>
            <tr><td>集約、重複除去</td><td>HashAggregate</td><td>Aggregate using temporary table</td></tr>
            <tr><td>読んだページ数</td><td>Buffers: shared hit</td><td>表示なし</td></tr>
          </tbody></table></div>
      </div>
      <div class="col">
        <div class="label">例：曜日ごとの来客数を合計する</div>
        ${pre(D.cc_where.sql)}
        <div class="label">PostgreSQLの実行計画</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>Seq ScanでCustomerCountの全14行を読み、Filterの条件に合わない6行を捨てます。</li>
          <li>HashAggregateが残りの8行をdowごとに集約します。</li>
          <li>Buffers: shared hit=1は、読んだページ数が1だったことを表します。</li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
  syntax: () => `<div class="grid">
      <div class="col">
        <div class="label">CASE式</div>
        ${pre("CASE WHEN 条件1 THEN 値1\n     WHEN 条件2 THEN 値2\n     ELSE 値3\nEND")}
        <ul class="points">
          <li>WHENを上から順に評価し、最初に真になった分岐の値を返します。残りのWHENは評価しません。</li>
          <li>どの条件も真にならなければ、ELSEの値を返します。ELSEを省略するとNULLを返します。</li>
          <li>CASE式は値を返す式です。SELECT句、WHERE句、集約関数の引数など、式を書ける場所ならどこにでも書けます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">UNION と UNION ALL</div>
        ${pre("SELECT col_1 FROM Table_A WHERE ...\nUNION ALL\nSELECT col_1 FROM Table_B WHERE ...")}
        <ul class="points">
          <li>複数のSELECT文の結果を縦につなぎます。各SELECT文の列の数と型をそろえます。</li>
          <li>UNIONは重複した行を1つにまとめます。UNION ALLは重複を残したままつなぎます。</li>
          <li>各SELECT文は、それぞれ別にテーブルを読みます。</li>
        </ul>
      </div>
    </div>`,
  branch: () => `<p class="prompt">例として、チケットの料金を平日と休日で切り替えて出すとします。Ticketsテーブルは平日料金と休日料金の両方の列を持っています。</p>
    <div class="grid">
      <div class="col">
        <div class="label">文で分岐する（UNION）</div>
        ${pre("SELECT ticket_date, price_weekday AS price\n  FROM Tickets\n WHERE is_holiday = 0\nUNION ALL\nSELECT ticket_date, price_holiday AS price\n  FROM Tickets\n WHERE is_holiday = 1;")}
        <p>条件ごとにSELECT文を書き、結果をつなぎます。手続き型の言語でIF文を書くときと同じ発想です。</p>
      </div>
      <div class="col">
        <div class="label">式で分岐する（CASE式）</div>
        ${pre("SELECT ticket_date,\n       CASE WHEN is_holiday = 0 THEN price_weekday\n            ELSE price_holiday END AS price\n  FROM Tickets;")}
        <p>1つのSELECT文の中で、行ごとに出す値を切り替えます。SQLの各句に書くのは式なので、分岐もCASE式で書けます。</p>
      </div>
    </div>
    <p class="takeaway">SQLの性能は、ストレージへのI/Oをどれだけ減らせるかで大きく変わります。<b>SELECT文が増えると、テーブルを読む回数も増えやすい。</b>実行計画で、テーブルを何回読んでいるかを確かめます。</p>`,
  agg: () => `<div class="grid">
      <div class="col">
        <div class="label">句を評価する順番</div>
        <div class="row">${["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY"].map(w => `<span class="chip pages">${w}</span>`).join("<span class=\"hint\">→</span>")}</div>
        <ul class="points">
          <li>WHERE句は集約の前に行を絞ります。集約関数はWHERE句に書けません。</li>
          <li>HAVING句とSELECT句は集約の後に評価します。COUNT(*)などの結果をCASE式の条件にも使えます。</li>
          <li>集約関数の中にCASE式を書くと、条件に合う行だけを集計できます。例：<code>SUM(CASE WHEN sex = '1' THEN pop ELSE 0 END)</code></li>
          <li>COUNT(式)とSUM(式)はNULLを無視します。COUNT(式)が数えるのは、NULL以外の値の件数です。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">インデックスとUNION</div>
        <ul class="points">
          <li>インデックスは、列の値から行の場所を引くための索引です。条件に合う行が少ないほど、全件を読むより速く探せます。</li>
          <li>条件ごとに別のインデックスを使える場合は、UNIONで書くと速くなることもあります。ORやINでもインデックスを使えるかどうかは、DBMSのオプティマイザ次第です。</li>
          <li>FROMのテーブルが異なるSELECT文の結果をまとめるときは、UNIONを使います。</li>
        </ul>
        <p class="takeaway"><b>どの書き方が速いかは、使うDBMSの実行計画で確かめる。</b></p>
      </div>
    </div>`,
};

const CH = {
  no: 3,
  store: "sql-jissen-ch3-drill-v2",
  h1: "SQLにおける条件分岐<br>文から式へ",
  lede: () => `UNIONとCASE式の書き分けを${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画が表示されます。走査の本数と読んだページ数を比べてください。`,
  points: [
    "SQLの性能は、ストレージへのI/Oをどれだけ減らせるかで決まる。",
    "UNIONで条件分岐を書きたくなったら、冗長性症候群を疑う。",
    "CASE式やINで書ければ、テーブルの走査を大きく減らせることがある。ただし、どれが速いかは実行計画で確かめる。",
    "文から式への発想の切り替えを身に付ける。",
  ],
  onClick: t => t.id === "stepNext" && ((step = step >= 4 ? 0 : step + 1), true),
  onReset: () => { step = 0; },
};
