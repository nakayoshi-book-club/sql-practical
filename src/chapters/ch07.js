const T = {
  receipts: { name: "Receipts（購入明細）", cols: ["cust_id", "seq", "price"], rows: [
    ["A",1,500],["A",2,1000],["A",3,700],
    ["B",5,100],["B",6,5000],["B",7,300],["B",9,200],["B",12,1000],
    ["C",10,600],["C",20,100],["C",45,200],["C",70,50],
    ["D",3,2000]] },
  companies: { name: "Companies（会社）", cols: ["co_cd", "district"], rows: [
    ["001","A"],["002","B"],["003","C"],["004","D"]] },
  shops: { name: "Shops（事業所）", cols: ["co_cd", "shop_id", "emp_nbr", "main_flg"], rows: [
    ["001","1",300,"Y"],["001","2",400,"N"],["001","3",250,"Y"],
    ["002","1",100,"Y"],["002","2",20,"N"],
    ["003","1",400,"Y"],["003","2",500,"Y"],["003","3",300,"N"],["003","4",200,"Y"],
    ["004","1",999,"Y"]] },
  bigcompanies: { name: "BigCompanies（会社・大）", cols: ["co_cd", "district"], rows: [
    ["0001","A"],["0002","B"],["0003","C"],["1000","L"]] },
  bigshops: { name: "BigShops（事業所・大）", cols: ["co_cd", "shop_id", "emp_nbr", "main_flg"], rows: [
    ["0001",1,11,"N"],["0001",2,12,"Y"],["0001",3,13,"N"],["0001",100,20,"Y"],["1000",100,20,"Y"]] },
};

const RECEIPTS_NOTE = "主キーは(cust_id, seq)です。seqは顧客ごとの購入の順番を表す枝番で、連番とは限りません。";
const BIG_NOTE = "BigCompaniesは1,000社、BigShopsは1社あたり100事業所の100,000行で、どちらも一部の行だけを表示しています。main_flgは事業所の半分がYです。インデックスは主キーだけです。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "sub", title: "サブクエリの問題点" },
  { type: "intro", id: "plan", title: "テーブルへのアクセス回数を数える" },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "サブクエリの問題点", ref: "sub",
    prompt: "サブクエリは、SELECT文の結果をその場でテーブルのように扱える便利な道具だ。本書が性能面の問題点として挙げていないのはどれ？",
    choices: [
      { text: "実体を持たないので、参照されるたびにSELECT文を実行するコストがかかる", ok: false, note: "本書が挙げている問題点です。サブクエリの結果は保存されないので、使うたびに作り直します。" },
      { text: "結果を保持するためにメモリを使い、足りないとストレージに書き出す", ok: false, note: "本書が挙げている問題点です。データ量が大きいとTEMP落ちして遅くなります。" },
      { text: "結果にインデックスや制約の情報がないので、最適化を受けにくい", ok: false, note: "本書が挙げている問題点です。オプティマイザは、サブクエリの結果について使える手掛かりを持ちません。" },
      { text: "標準SQLにない機能なので、DBMSによっては使えない", ok: true, note: "サブクエリは標準SQLの機能で、主要なDBMSはどれも使えます。問題は移植性ではなく性能です。" },
    ],
    takeaway: "<b>サブクエリは、計算コスト、I/Oコスト、最適化の3つの面で不利になりやすい。</b>ただしこれは傾向で、オプティマイザがサブクエリを結合に書き換えることもあります。実際にどう実行されたかは実行計画で確かめます。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "顧客ごとの最初の購入金額", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "顧客ごとに、seqが最も小さい行の金額を取り出したい。正しい結果を返し、かつReceiptsを1回しか読まないのはどれ？",
    choices: [
      { q: "min_price", tag: "MIN(seq)とMIN(price)", ok: false, note: "seqとpriceの最小値を別々に取っています。顧客Cの金額は、seqが10の行の600ではなく、全体の最小の50になります（結果タブ）。" },
      { q: "min_join", tag: "サブクエリと結合", ok: false, note: "結果は正しく、A 500、B 100、C 600、D 2000です。ただしPostgreSQLの計画にはSeq Scan on receiptsが2つあります。1回目でMIN(seq)を集約し、2回目で元の行と結合しています。" },
      { q: "min_window", tag: "ROW_NUMBER", ok: true, note: "Seq Scan on receiptsは1つだけです。cust_idとseqでSortし、WindowAggで顧客ごとに1から番号を振ってから、番号が1の行を残します。Run Conditionは、PostgreSQLが番号が2以上の行の計算を打ち切っていることを表します。" },
    ],
    takeaway: "本書はこれを<b>サブクエリ・パラノイア</b>と呼びます。<b>集約したサブクエリを元のテーブルと結合すると、同じテーブルを2回読む。</b>ウィンドウ関数なら1回で済み、結合もなくなります。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "相関サブクエリで書くと", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "同じ問題を、WHERE句の相関サブクエリで書いた。PostgreSQLの実行計画で、サブクエリ（SubPlan 1）は何回実行された？",
    choices: [
      { text: "1回", ok: false, note: "相関サブクエリは外側の行の値（R1.cust_id）を使うので、1回の実行では済みません。" },
      { text: "4回", ok: false, note: "顧客の数です。PostgreSQLは同じcust_idの結果を使い回さず、外側の行ごとに実行しました。" },
      { text: "13回", ok: true, note: "AggregateとSeq Scan on receipts r2にloops=13とあります。Receiptsの13行それぞれについて、同じ顧客の行を読み直してMIN(seq)を求めています。キャッシュから読んだページも、結合版の2に対して14です。" },
      { text: "0回（結合に書き換えられた）", ok: false, note: "この計画にJoinは出てきません。Filter: (seq = (SubPlan 1))のとおり、サブクエリのまま実行しています。" },
    ],
    show: [{ q: "min_corr", tag: "相関サブクエリ" }, { q: "min_join", tag: "サブクエリと結合" }, { q: "min_window", tag: "ROW_NUMBER" }],
    takeaway: "相関サブクエリも結合と同じく、<b>Receiptsへのアクセスが2系統</b>あります。本書の言うとおり、実行計画の形は結合版とほとんど変わりません。MySQLも「dependent」なサブクエリとしてloops=13で実行し、主キーで同じ顧客の行だけを探しています。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "MySQLの集約サブクエリ", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE, db: "my",
    prompt: "サブクエリと結合で書いた解を、MySQL 8.0で実行した。顧客ごとのMIN(seq)を求めるサブクエリを、MySQLはどう処理した？",
    choices: [
      { text: "Receiptsを全件読み、一時テーブルで集約した", ok: false, note: "Table scan on Receiptsも、Aggregate using temporary tableも出てきません。" },
      { text: "主キーのインデックスで、顧客ごとの先頭の1行だけを飛び飛びに読んだ", ok: true, note: "Covering index skip scan for groupingです。主キーが(cust_id, seq)の順なので、各cust_idの先頭がMIN(seq)になります。4顧客の先頭だけを読み、Materializeで結果を一時テーブルにしています。" },
      { text: "Hash JoinでReceipts同士を結合してから集約した", ok: false, note: "結合はNested loop inner joinで、集約が先です。" },
      { text: "サブクエリを消して、Receiptsを1回だけ読んだ", ok: false, note: "サブクエリは残っています。R2を作った後、Single-row index lookup on R1で元の行をもう一度探しています（loops=4）。" },
    ],
    show: [{ q: "min_join", tag: "サブクエリと結合" }, { q: "min_window", tag: "ROW_NUMBER" }],
    takeaway: "インデックスのおかげで読む行は少ないものの、<b>Receiptsへのアクセスは2回のまま。</b>MySQLの計画は外側から、Materialize（サブクエリの結果を一時テーブルに保存）、Table scan on R2、R1の主キー検索の順に読みます。ウィンドウ関数版はTable scan on Receiptsが1回です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "結合をなくすことの意味", ref: "sub",
    prompt: "サブクエリと結合の解に比べて、ウィンドウ関数の解が長期的に安定すると本書が言う理由はどれ？",
    choices: [
      { text: "ウィンドウ関数はソートを使わないので、メモリが足りなくなることがない", ok: false, note: "ウィンドウ関数は内部でソートします。実行計画にもSortがあります。" },
      { text: "結合がなくなるので、結合アルゴリズムが切り替わるリスクや、メモリ不足で遅くなるリスクを避けられる", ok: true, note: "結合はデータ量や統計情報の変化で、Nested LoopsとHashなどが切り替わります。結合がなければ、その変動の余地がありません。" },
      { text: "ウィンドウ関数は必ずインデックスを使う", ok: false, note: "PostgreSQLの計画はSeq Scanです。インデックスを使うとは限りません。" },
      { text: "ウィンドウ関数の結果はキャッシュされ、2回目以降は計算しない", ok: false, note: "そのような仕組みはありません。" },
    ],
    takeaway: "<b>シンプルな実行計画は、性能の変動リスクも小さい。</b>テーブルを読む回数が減るだけでなく、実行計画の不確定要素を減らせます。第6章の「結合を避ける」戦略の具体例です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "最初と最後の購入金額の差", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "顧客ごとに、最も小さいseqの金額から最も大きいseqの金額を引きたい。正しい結果を返し、かつReceiptsを1回しか読まないのはどれ？",
    choices: [
      { q: "diff_minmax", tag: "MIN(price) - MAX(price)", ok: false, note: "金額の最小値と最大値の差で、seqを見ていません。顧客Bは-900ではなく-4900になります。" },
      { q: "diff_join", tag: "サブクエリを4つ結合", ok: false, note: "結果は正しく、A -200、B -900、C 550、D 0です。ただしPostgreSQLの計画では、Receiptsを読む行が4つあります（Seq Scanが3つと、r3のIndex Scan）。" },
      { q: "diff_window", tag: "ROW_NUMBERを2つ", ok: true, note: "seqの昇順と降順で2つの番号を振り、どちらかが1の行だけを残してから、CASE式で最初と最後の金額を取り出します。Seq Scan on receiptsは1つです。" },
    ],
    takeaway: "購入が1回の顧客Dは、同じ行が最初と最後を兼ねるので差は0です。<b>行をまたぐ比較も、ウィンドウ関数で番号を振れば1行の中の比較に変えられる。</b>",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "ウィンドウ関数の解のコスト", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "前の問題の正解（ROW_NUMBERを2つ使う解）を、PostgreSQLの実行計画で見た。Receiptsを読む回数とソートの回数の組み合わせはどれ？",
    choices: [
      { text: "読む1回、ソート0回", ok: false, note: "ROW_NUMBERは順番を決めるために、行を並べ替えます。" },
      { text: "読む1回、ソート2回", ok: true, note: "最初のSortでcust_id、seq DESCの順に並べて1つ目のWindowAggを計算し、次のIncremental Sortでcust_id、seqの順に並べ直しています。cust_idで並んでいる（Presorted Key）ので、2回目はcust_idごとに並べ替えるだけです。" },
      { text: "読む2回、ソート2回", ok: false, note: "Seq Scan on receiptsは1つだけです。読んだ結果を2回並べ替えています。" },
      { text: "読む4回、ソート0回", ok: false, note: "サブクエリを4つ結合した解の計画です（実行計画タブの「サブクエリを4つ結合」）。こちらはHashAggregateで集約し、ソートはしていません。" },
    ],
    show: [{ q: "diff_window", tag: "ROW_NUMBERを2つ" }, { q: "diff_join", tag: "サブクエリを4つ結合" }],
    takeaway: "<b>ウィンドウ関数は、テーブルを読む回数を減らす代わりにソートを使う。</b>ORDER BYの異なるウィンドウ関数が2つあれば、ソートも2回です。ソートはメモリを使うので、大きなデータではTEMP落ちに注意します。MySQLもSortを2回行い、間に一時テーブルを挟んでいます。",
  },
  {
    type: "q", sec: "7.2 サブクエリの積極的意味", title: "主要事業所の従業員数", ref: "plan", table: ["companies", "shops"],
    prompt: "会社ごとに、主要事業所（main_flgがY）の従業員数を合計したい。正しい結果を返し、結合の前に集約して結合する行を減らしているのはどれ？",
    choices: [
      { q: "agg_after", tag: "結合してから集約", ok: false, note: "結果は正しく、001が550、002が100、003が1,100、004が999です。ただし集約が後なので、Hash Joinは主要事業所の7行をそのまま結合しています。" },
      { q: "agg_before", tag: "集約してから結合", ok: true, note: "サブクエリのHashAggregateで先に会社ごとの4行にまとめ、Companiesの4行と結合しています。Hash Joinの入力は4行と4行です。" },
      { q: "agg_noflag", tag: "main_flgの条件なし", ok: false, note: "主要でない事業所も足しています。001は550ではなく950になります。" },
    ],
    takeaway: "本書はここで<b>サブクエリを積極的に使う</b>場面を示します。<b>集約で行数を減らしてから結合すれば、結合のコストを下げられる。</b>結合の前に中間データを小さくするのは、結合を速くする基本です。",
  },
  {
    type: "q", sec: "7.2 サブクエリの積極的意味", title: "規模を大きくして比べる", ref: "plan", table: ["bigcompanies", "bigshops"], tableNote: BIG_NOTE,
    prompt: "1,000社×100事業所のテーブルで、前の問題の2つの解を比べた。PostgreSQLのHash Joinノードが出力した行数（actual rows）はどれ？",
    choices: [
      { text: "結合してから集約は50,000行、集約してから結合は1,000行", ok: true, note: "結合してから集約では、主要事業所の50,000行がすべて結合を通ります。集約してから結合では、HashAggregateで1,000行にまとめてから結合しています。" },
      { text: "どちらも1,000行", ok: false, note: "結合してから集約では、集約はHash Joinの後です。Hash Joinは50,000行を出力しています。" },
      { text: "どちらも50,000行", ok: false, note: "集約してから結合では、HashAggregateが先に1,000行にまとめています。" },
      { text: "結合してから集約は100,000行、集約してから結合は1,000行", ok: false, note: "main_flgの条件で、BigShopsはSeq Scanの段階で50,000行に絞られています（Rows Removed by Filter: 50000）。" },
    ],
    show: [{ q: "big_after", tag: "結合してから集約" }, { q: "big_before", tag: "集約してから結合" }], showDefault: 1,
    takeaway: "どちらもキャッシュから読んだページは642で、<b>テーブルを読む量は同じ。差が出るのは結合する行数</b>です。MySQLでは、結合してから集約の解がBigShopsを主キーで1,000回探し（loops=1000）、合計100,000行を読みました。集約してから結合の解では、集約の結果を一時テーブルにしてから1,000社と結合しています。",
  },
  {
    type: "q", sec: "7.2 サブクエリの積極的意味", title: "先に集約が効く条件", ref: "sub",
    prompt: "「集約してから結合」が「結合してから集約」より大きく有利になるのは、どんなデータのとき？",
    choices: [
      { text: "集約で行数が大きく減るとき（1社あたりの事業所が多いとき）", ok: true, note: "集約で減った分だけ、結合する行が減ります。1,000社×100事業所の例では、50,000行が1,000行になりました。" },
      { text: "1社あたりの事業所がほぼ1つのとき", ok: false, note: "集約しても行数がほとんど減らないので、結合のコストは変わりません。集約のためのサブクエリの分だけ不利になることもあります。" },
      { text: "Companiesが大きく、Shopsが小さいとき", ok: false, note: "集約するのはShopsです。Shopsが小さければ、もともと結合のコストは小さくなります。" },
      { text: "どんなデータでも同じだけ有利になる", ok: false, note: "効果は、集約でどれだけ行数が減るかで決まります。" },
    ],
    takeaway: "<b>サブクエリは悪ではなく、結合の前に中間データを小さくする道具にもなる。</b>本書の例のような小さなデータでは差は出ません。データの分布を見て、中間データが小さくなる順序を選びます。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  sub: () => `<div class="grid">
      <div class="col">
        <div class="label">サブクエリの3つの問題点</div>
        <ul class="points">
          <li><b>計算コスト</b>：サブクエリは実体を持たないので、参照されるたびにSELECT文を実行して結果を作ります。</li>
          <li><b>I/Oコスト</b>：結果を保持するためにメモリを使い、足りなければストレージに書き出します（TEMP落ち）。</li>
          <li><b>最適化</b>：サブクエリの結果にはインデックスや制約の情報がなく、オプティマイザが手掛かりを得られません。</li>
        </ul>
        <div class="label">サブクエリ・パラノイア</div>
        <ul class="points">
          <li>問題を細かく分け、サブクエリを組み合わせて解こうとする書き方です。考え方としては自然ですが、同じテーブルを何度も読み、結合が増えます。</li>
          <li>典型は、集約したサブクエリを元のテーブルと結合する形です。ウィンドウ関数を使えば、多くの場合は1回の読み込みで書けます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">結合をなくすことの効果</div>
        <ul class="points">
          <li>テーブルを読む回数が減ります。</li>
          <li>結合アルゴリズムの選択がなくなり、データ量の増加で実行計画が切り替わるリスクを避けられます。</li>
          <li>結合のためのハッシュテーブルなど、メモリを使う処理が減ります。</li>
        </ul>
        <div class="label">サブクエリを積極的に使う場面</div>
        <ul class="points">
          <li>結合の前に集約して、結合する行数を減らしたいときです。結合の対象が小さいほど、結合は速くなります。</li>
        </ul>
        <p class="takeaway"><b>サブクエリを書いたら、同じテーブルを何回読んでいるかを数える。</b>ウィンドウ関数で1回にまとめられないかを考えます。</p>
      </div>
    </div>`,
  plan: () => {
    const r = analyze(D.min_join.pg, "pg");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">実行計画は木の形をしていて、インデントの深い行から先に実行します。同じテーブルを読む行が何か所あるかを数えると、そのテーブルへのアクセス回数がわかります。</p>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>見るところ</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
          <tbody>
            <tr><td>テーブルを読む行</td><td>Seq Scan on、Index Scan using</td><td>Table scan on、Index lookup on</td></tr>
            <tr><td>行ごとに実行するサブクエリ</td><td>SubPlan（loops=行数）</td><td>Select #2 ... dependent</td></tr>
            <tr><td>サブクエリの結果を保存</td><td>Subquery Scan、Materialize</td><td>Materialize</td></tr>
            <tr><td>ウィンドウ関数</td><td>WindowAgg（下にSort）</td><td>Window aggregate</td></tr>
          </tbody></table></div>
        <p class="prompt">loops=Nは、その行がN回実行されたことを表します。rowsは1回あたりの行数です。</p>
      </div>
      <div class="col">
        <div class="label">例：顧客ごとの最初の購入金額（サブクエリと結合）</div>
        ${pre(D.min_join.sql)}
        <div class="label">PostgreSQLの実行計画</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>下のSeq Scan on receiptsで13行を読み、HashAggregateで顧客ごとのMIN(seq)を4行にまとめます。</li>
          <li>上のSeq Scan on receipts r1で、もう一度13行を読みます。</li>
          <li>Hash Joinが2つを突き合わせ、4行を返します。Receiptsを2回読んでいます。</li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
};

const CH = {
  no: 7,
  store: "sql-jissen-ch7-drill-v1",
  h1: "サブクエリ<br>サブクエリ・パラノイア",
  lede: () => `サブクエリの弊害と、ウィンドウ関数による書き換えを${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画と結果が表示されます。同じテーブルを何回読んでいるかを数えてください。`,
  points: [
    "サブクエリは問題を分割して考えるには便利だが、性能面では計算コスト、I/Oコスト、最適化の点で不利になりやすい。",
    "集約したサブクエリを元のテーブルと結合すると、同じテーブルを何度も読む。",
    "ウィンドウ関数を使えば、テーブルへのアクセスを1回にまとめ、結合をなくせることが多い。",
    "結合をなくせば、実行計画の変動リスクも小さくなる。",
    "結合の前に集約して中間データを小さくするのは、サブクエリの積極的な使い方。",
  ],
};
