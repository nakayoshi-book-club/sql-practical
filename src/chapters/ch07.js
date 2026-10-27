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

const RECEIPTS_NOTE = "主キーは(cust_id, seq)です。seqは顧客の古い購入ほど小さい値が振られた連番で、顧客ごとの最小値は1とは限りません。";
const BIG_NOTE = "このドリルで用意した表で、本書にはありません。BigCompaniesは1,000社、BigShopsは1社あたり100事業所の100,000行で、どちらも一部の行だけを表示しています。main_flgは事業所の半分がYです。インデックスは主キーだけです。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "sub", title: "サブクエリの問題点" },
  { type: "intro", id: "plan", title: "テーブルへのアクセス回数を数える" },
  {
    type: "q", sec: "第7章の導入", title: "テーブル、ビュー、サブクエリ", ref: "sub",
    prompt: "テーブル、ビュー、サブクエリは、機能的にはまったく同じように扱える。性能の観点から見た違いとして正しいのはどれ？",
    choices: [
      { text: "ビューは永続的だがデータを保持しないので、アクセスのたびにSELECT文を実行する", ok: true, note: "テーブルは永続的でデータを保持し、ビューは定義だけが永続的です。サブクエリは永続的でもなく、生存期間はそのSQL文の実行中に限られます。" },
      { text: "ビューは結果を保存しておくので、テーブルと同じ速さで読める", ok: false, note: "保存しているのは定義だけです。結果を保存するのはマテリアライズドビューで、ビューとは別の機能です。" },
      { text: "サブクエリは一度実行すると結果が保存され、別のSQL文からも使える", ok: false, note: "サブクエリの生存期間は、そのSQL文の実行中だけです。" },
      { text: "3つとも実体のデータを持つので、性能に違いはない", ok: false, note: "データを保持するのはテーブルだけです。本書は、同じデータでもサブクエリやビューはテーブルより性能が悪い傾向がある、と述べています。" },
    ],
    takeaway: "<b>テーブルとサブクエリに違いがないのは機能の面だけ。</b>サブクエリは実体のデータを持たないことが、この章で扱う性能問題の出発点です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "サブクエリの3つの問題点", ref: "sub",
    prompt: "サブクエリが実体のデータを持たないことから、3つの性能問題が生じる。本書が挙げていないのはどれ？",
    choices: [
      { text: "アクセスのたびに中身のSELECT文を実行するコストが上乗せされる", ok: false, note: "本書が挙げている問題です。中身が複雑なほどコストは大きくなります。" },
      { text: "結果を保持するための書き込みが要り、量が多いとファイルに書き出されてTEMP落ちする", ok: false, note: "本書が挙げている問題です。ストレージの性能に引っ張られ、急に遅くなります。" },
      { text: "制約やインデックスといったメタ情報がないので、最適化を受けられない", ok: false, note: "本書が挙げている問題です。オプティマイザが手掛かりにできる情報がありません。" },
      { text: "サブクエリを使うと、外側のSQL文がテーブルをロックする時間が延びる", ok: true, note: "ロックは本章で挙げられている問題ではありません。3つの問題は、計算コスト、I/Oコスト、最適化を受けられないことです。" },
    ],
    takeaway: "<b>サブクエリを使うときは、それが本当にサブクエリでないと実現できないのかを考える。</b>なお最近のDBMSには、サブクエリの内側と外側をまとめて1つの計画にするビューマージという最適化もあります（演習問題7）。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "顧客ごとの最初の購入金額", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "顧客ごとに、seqが最も小さい行の金額を取り出したい。正しい結果を返し、かつReceiptsを1回しか読まないのはどれ？",
    choices: [
      { q: "min_price", tag: "MIN(seq)とMIN(price)", ok: false, note: "seqとpriceの最小値を別々に取っています。顧客Cの金額は、seqが10の行の600ではなく、全体の最小の50になります（結果タブ）。" },
      { q: "min_join", tag: "サブクエリと結合", ok: false, note: "本書が最初に示す、素直な解です。結果は正しいものの、PostgreSQLの計画にはSeq Scan on receiptsが2つあります。1回目でMIN(seq)を集約し、2回目で元の行と結合しています。" },
      { q: "min_window", tag: "ROW_NUMBER", ok: true, note: "Seq Scan on receiptsは1つだけです。ROW_NUMBERで顧客ごとに1から番号を振ると、seqの最小値が不確定でも「番号が1の行」で取り出せます。" },
    ],
    takeaway: "<b>集約したサブクエリを元のテーブルと結合すると、同じテーブルを2回読む。</b>本書はSQLチューニングの要諦を「1にI/O、2にI/O、3、4がなくて5にI/O」と言います。MySQLの計画（主キーを使ったCovering index skip scan）でも、Receiptsへのアクセスは2回です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "サブクエリと結合の解が遅い理由", ref: "sub", table: ["receipts"],
    prompt: "サブクエリと結合の解は読みにくいだけでなく、性能も悪い。本書が挙げる理由に含まれないのはどれ？",
    choices: [
      { text: "サブクエリの結果が一時的な領域に確保され、オーバーヘッドが生じる", ok: false, note: "本書が挙げている理由です。" },
      { text: "サブクエリR2には、(cust_id, seq)で一意だという制約やインデックスの情報がない", ok: false, note: "本書が挙げている理由です。人間には一意だとわかっても、オプティマイザはその情報を結合に使えません。" },
      { text: "結合が必要なのでコストが高く、実行計画が変動するリスクもある", ok: false, note: "本書が挙げている理由です。" },
      { text: "MIN関数は、インデックスがあっても必ず全件をソートする", ok: true, note: "本書の理由ではありません。4つ目の理由は、Receiptsテーブルへのスキャンが2回必要になることです。MySQLのように、MINをインデックスで求めるDBMSもあります。" },
    ],
    show: [{ q: "min_join", tag: "サブクエリと結合" }],
    takeaway: "4つの理由は、一時領域のオーバーヘッド、最適化を受けられないこと、結合のコストと計画変動のリスク、<b>同じテーブルへの2回のスキャン</b>です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "相関サブクエリは解にならない", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "同じ問題を、WHERE句の相関サブクエリで書いた。PostgreSQLの実行計画で、サブクエリ（SubPlan 1）は何回実行された？",
    choices: [
      { text: "1回", ok: false, note: "相関サブクエリは外側の行の値（R1.cust_id）を使うので、1回では済みません。" },
      { text: "4回", ok: false, note: "顧客の数です。PostgreSQLは同じcust_idの結果を使い回さず、外側の行ごとに実行しました。" },
      { text: "13回", ok: true, note: "AggregateとSeq Scan on receipts r2にloops=13とあります。Receiptsの13行それぞれについて、同じ顧客の行を読み直しています。キャッシュから読んだページも、結合版の2に対して14です。" },
      { text: "0回（Receiptsを1回読むだけの計画になった）", ok: false, note: "Filter: (seq = (SubPlan 1))のとおり、サブクエリのまま実行しています。Receiptsへのアクセスは2系統あります。" },
    ],
    show: [{ q: "min_corr", tag: "相関サブクエリ" }, { q: "min_join", tag: "サブクエリと結合" }, { q: "min_window", tag: "ROW_NUMBER" }],
    takeaway: "<b>相関サブクエリに書き換えても、テーブルへのアクセスは2回のまま。</b>本書の図では、Oracleは相関サブクエリを内部でビュー（VW_SQ_1）に変換し、Hash結合で実行しています。実行計画は結合とほとんど同じなので、性能上のメリットはありません。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "MySQLの<auto_key0>", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE, db: "my",
    prompt: "ROW_NUMBERの解のMySQLの計画は、Index lookup on WORK using <auto_key0> (row_seq=1)から始まる。この行は何をしている？",
    choices: [
      { text: "Receiptsの主キーのインデックスで、row_seqが1の行を探している", ok: false, note: "row_seqはサブクエリWORKの列で、Receiptsの主キーにはありません。" },
      { text: "サブクエリWORKのrow_seq列に一時的なインデックスを作り、それで1の行を探している", ok: true, note: "<auto_key0>は、MySQLが最適化のために一時的に作ったインデックスの名前です。Materializeでサブクエリの結果を一時テーブルにし、そこにインデックスを作っています。" },
      { text: "row_seqが1の行がないかを、全件を読んで確かめている", ok: false, note: "全件を読むならTable scanと表示されます。" },
      { text: "ウィンドウ関数の計算を、row_seqが1になったところで打ち切っている", ok: false, note: "それに近いのは、PostgreSQLのRun Conditionや、OracleのWINDOW SORT PUSHED RANKです。" },
    ],
    show: [{ q: "min_window", tag: "ROW_NUMBER" }],
    takeaway: "インデックスを作るにもコストがかかるので、<b>この戦略が得になるかはWORKの大きさ次第</b>です。小さすぎると、作るコストのほうが高くつきます。PostgreSQLのRun Condition: (row_number() OVER (?) <= 1)と、本書のOracleの計画のWINDOW SORT PUSHED RANKは、どちらも外側の条件row_seq = 1をウィンドウ関数の計算に持ち込む最適化です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "結合を使うクエリの2つの不安定要因", ref: "sub",
    prompt: "結合を消すことには、性能を上げるだけでなく、性能を安定させる利点もある。本書が挙げる、結合を使うクエリの2つの不安定要因はどれ？",
    choices: [
      { text: "結合アルゴリズムの変動リスクと、環境に起因する遅延リスク", ok: true, note: "件数が増えて閾値を超えると、Nested LoopsからHashなどに計画が変わります。また、インデックスの有無やワーキングメモリの大きさといった環境で性能が左右されます。" },
      { text: "ロックの競合と、デッドロックのリスク", ok: false, note: "本章で扱っているのは、検索の実行計画の不安定さです。" },
      { text: "結果の行の順序の変動と、重複行の発生", ok: false, note: "結合を消しても結果は同じです。変わるのは性能の安定性です。" },
      { text: "構文の移植性と、オプティマイザのバージョンアップ", ok: false, note: "本書が挙げている2つの要因ではありません。" },
    ],
    takeaway: "相関サブクエリも、実行計画は結合とほぼ同じなので、同じリスクを抱えます。<b>シンプルな実行計画ほど性能が安定する。</b>本書は、非機能を担保するのもエンジニアの責任だと述べています。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "ウィンドウ関数とTEMP落ち", ref: "sub",
    prompt: "ウィンドウ関数もソートを使う。ウィンドウ関数を使った解で、メモリが足りずにストレージに書き出す「TEMP落ち」は起きるか？ 本書の考え方に最も近いのはどれ？",
    choices: [
      { text: "起きない。ウィンドウ関数はメモリを使わない", ok: false, note: "ウィンドウ関数はソートを行うので、メモリを使います。" },
      { text: "起き得るが、ウィンドウ関数は後のステップで実行されるので、対象の行が絞られていてメモリも小さく済むことが期待できる", ok: true, note: "ウィンドウ関数はSELECT句で、WHERE句などで行を絞った後に実行されます。結合のSort MergeやHashほど大きなメモリは要らないことが多い、というのが本書の考え方です。" },
      { text: "必ず起きる。だからウィンドウ関数より結合のほうが安定する", ok: false, note: "本書の主張とは逆です。" },
      { text: "結合と同じだけ起きやすいので、どちらを選んでも変わらない", ok: false, note: "対象の行数が違うので、同じとは言えません。" },
    ],
    takeaway: "<b>結合を消せばTEMP落ちの心配がなくなるわけではない。</b>それでも、扱う行数が少ない段階でソートするので、リスクは小さくなります。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "最初と最後の購入金額の差", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "顧客ごとに、最も小さいseqの金額から最も大きいseqの金額を引きたい（行間比較）。正しい結果を返し、かつReceiptsを1回しか読まないのはどれ？",
    choices: [
      { q: "diff_minmax", tag: "MIN(price) - MAX(price)", ok: false, note: "金額の最小値と最大値の差で、seqを見ていません。顧客Bは-900ではなく-4900になります。" },
      { q: "diff_join", tag: "サブクエリを4つ結合", ok: false, note: "本書が「サブクエリ・パラノイア」と呼ぶ解です。結果は正しいものの、PostgreSQLの計画ではReceiptsを読む行が4つあります（Seq Scanが3つと、r3のIndex Scan）。" },
      { q: "diff_window", tag: "ROW_NUMBERを2つ", ok: true, note: "seqの昇順と降順で2つの番号を振り、どちらかが1の行、つまり両端の行だけを残します。Seq Scan on receiptsは1つで、結合もありません。" },
    ],
    takeaway: "購入が1回の顧客Dは、同じ行が最初と最後を兼ねるので差は0です。<b>行間比較でも結合は必要ない。</b>",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "SUMの中のCASE式", ref: "plan", table: ["receipts"],
    prompt: "前の問題の正解では、2つのSUMの中にCASE式を書いて引き算している。なぜこうするのか？",
    code: "SELECT cust_id,\n       SUM(CASE WHEN min_seq = 1 THEN price ELSE 0 END)\n         - SUM(CASE WHEN max_seq = 1 THEN price ELSE 0 END) AS diff\n  FROM (...) WORK\n WHERE WORK.min_seq = 1 OR WORK.max_seq = 1\n GROUP BY cust_id;",
    choices: [
      { text: "最初と最後の金額は別々の行にあり、行同士は引き算できないから。GROUP BYで1行にまとめ、CASE式で2つの金額を別々の列に振り分けている", ok: true, note: "WHERE句の時点では、最初の行と最後の行が別の行として残っています。GROUP BY cust_idで1行にまとめるとき、CASE式で最初の金額と最後の金額を分けて集計しています。" },
      { text: "SUMを使わないと、金額がNULLの行でエラーになるから", ok: false, note: "priceはNOT NULLです。SUMの目的は、行をまとめることです。" },
      { text: "同じ顧客に最初の行が複数あるとき、合計するため", ok: false, note: "ROW_NUMBERは顧客ごとに重複のない番号を振るので、min_seqが1の行は1顧客に1行です。" },
      { text: "CASE式を使うとソートが1回減るから", ok: false, note: "ソートの回数は、2つのROW_NUMBERのORDER BYで決まります。" },
    ],
    show: [{ q: "diff_window", tag: "ROW_NUMBERを2つ" }],
    takeaway: "<b>別々の行にある値を比べるには、集約で1行にまとめ、CASE式で列に振り分ける。</b>第4章で見た、集約関数の中にCASE式を書く技法の応用です。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "ウィンドウ関数の解のコスト", ref: "plan", table: ["receipts"], tableNote: RECEIPTS_NOTE,
    prompt: "ROW_NUMBERを2つ使う解を、PostgreSQLの実行計画で見た。Receiptsを読む回数とソートの回数の組み合わせはどれ？",
    choices: [
      { text: "読む1回、ソート0回", ok: false, note: "ROW_NUMBERは順番を決めるために、行を並べ替えます。" },
      { text: "読む1回、ソート2回", ok: true, note: "最初のSortでcust_id、seq DESCの順に並べて1つ目のWindowAggを計算し、次のIncremental Sortでcust_id、seqの順に並べ直しています。cust_idで並んでいる（Presorted Key）ので、2回目はcust_idごとに並べ替えるだけです。" },
      { text: "読む2回、ソート2回", ok: false, note: "Seq Scan on receiptsは1つだけです。読んだ結果を2回並べ替えています。" },
      { text: "読む4回、ソート0回", ok: false, note: "サブクエリを4つ結合した解の計画です（実行計画タブの「サブクエリを4つ結合」）。" },
    ],
    show: [{ q: "diff_window", tag: "ROW_NUMBERを2つ" }, { q: "diff_join", tag: "サブクエリを4つ結合" }],
    takeaway: "ソートが2回なのは、ORDER BY seqとORDER BY seq DESCの昇順と降順で並べるからです。本書は、<b>結合を繰り返すよりは安く、計画の安定性も得られる、十分に採算の取れる取引</b>だと評価しています。",
  },
  {
    type: "q", sec: "7.1 サブクエリが引き起こす弊害", title: "困難は分割するな", ref: "sub",
    prompt: "サブクエリは問題を分割して考えるのに便利だ。サブクエリとの付き合い方について、本書の考え方に最も近いのはどれ？",
    choices: [
      { text: "サブクエリは絶対悪なので、どんな場合も使ってはならない", ok: false, note: "本書は、サブクエリは絶対悪ではなく、サブクエリなしでは解けない局面も多いと明記しています。" },
      { text: "考える段階ではサブクエリで問題を分割してよいが、コードでは最後に統合しないと効率的にならない", ok: true, note: "サブクエリは思考の補助線として有用です。ただし非手続き型のSQLでは、部品を組み合わせるボトムアップ型のコードは効率が悪くなりがちです。" },
      { text: "読みやすさのため、問題はできるだけ細かいサブクエリに分けて書くのがよい", ok: false, note: "サブクエリの階層が深いと追うのが大変で、可読性はむしろ下がります。" },
      { text: "サブクエリはオプティマイザが必ず展開するので、書き方は気にしなくてよい", ok: false, note: "展開されるとは限りません。この章の計画はどれも、サブクエリの分だけテーブルを読んでいます。" },
    ],
    takeaway: "<b>考えるときは分割してよい。コードでは統合する。</b>章のタイトル「困難は分割するべきか」への本書の答えです。",
  },
  {
    type: "q", sec: "7.2 サブクエリの積極的意味", title: "主要事業所の従業員数", ref: "plan", table: ["companies", "shops"],
    prompt: "会社ごとに、主要事業所（main_flgがY）の従業員数を合計し、会社の地域（district）も表示したい。正しい結果を返し、結合の前に集約して結合する行を減らしているのはどれ？",
    choices: [
      { q: "agg_after", tag: "解1：結合が先", ok: false, note: "結果は正しく、001が550、002が100、003が1,100、004が999です。ただし集約が後なので、Hash Joinは主要事業所の7行をそのまま結合しています。districtは集約キーにないので、MAX(C.district)で取り出しています。" },
      { q: "agg_before", tag: "解2：集約が先", ok: true, note: "サブクエリCSUMで先に会社ごとの4行にまとめ、Companiesの4行と1対1で結合しています。計画でも、HashAggregateとHash Joinの順序が解1と入れ替わっています。" },
      { q: "agg_noflag", tag: "main_flgの条件なし", ok: false, note: "主要でない事業所も足しています。001は550ではなく950になります。" },
    ],
    takeaway: "本書の数え方では、結合の対象は解1が会社4行と事業所10行、解2が会社4行とCSUM 4行です。<b>サブクエリで先に集約すれば、結合する行数を減らせる。</b>",
  },
  {
    type: "q", sec: "7.2 サブクエリの積極的意味", title: "規模を大きくして比べる", ref: "plan", table: ["bigcompanies", "bigshops"], tableNote: BIG_NOTE,
    prompt: "1,000社×100事業所のテーブルで、解1と解2を比べた。PostgreSQLのHash Joinノードが出力した行数（actual rows）はどれ？",
    choices: [
      { text: "解1は50,000行、解2は1,000行", ok: true, note: "解1では、主要事業所の50,000行がすべて結合を通ります。解2では、HashAggregateで1,000行にまとめてから結合しています。" },
      { text: "どちらも1,000行", ok: false, note: "解1では、集約はHash Joinの後です。Hash Joinは50,000行を出力しています。" },
      { text: "どちらも50,000行", ok: false, note: "解2では、HashAggregateが先に1,000行にまとめています。" },
      { text: "解1は100,000行、解2は1,000行", ok: false, note: "main_flgの条件で、BigShopsはSeq Scanの段階で50,000行に絞られています（Rows Removed by Filter: 50000）。" },
    ],
    show: [{ q: "big_after", tag: "解1：結合が先" }, { q: "big_before", tag: "解2：集約が先" }], showDefault: 1,
    takeaway: "どちらもキャッシュから読んだページは642で、<b>テーブルを読む量は同じ。差が出るのは結合する行数</b>です。本書の例は会社1,000行、主要事業所500万行で、集約すると1,000行になります。MySQLの解1は、BigShopsを主キーで1,000回探し（loops=1000）、合計100,000行を読みました。",
  },
  {
    type: "q", sec: "7.2 サブクエリの積極的意味", title: "先に集約が効く条件", ref: "sub",
    prompt: "解2（集約が先）が解1（結合が先）より大きく有利になるのは、どんなときか？",
    choices: [
      { text: "会社の数に比べて、事業所の行数が極めて大きいとき", ok: true, note: "集約で減る行数が大きいほど、結合のI/Oコストを削れます。本書の例では、500万行が1,000行になります。" },
      { text: "1社あたりの事業所がほぼ1つのとき", ok: false, note: "集約しても行数がほとんど減らないので、結合のコストは変わりません。集約の分だけ不利になることもあります。" },
      { text: "Companiesが大きく、Shopsが小さいとき", ok: false, note: "集約するのはShopsです。Shopsが小さければ、もともと結合のコストは小さくなります。" },
      { text: "どんなデータでも、解2のほうが必ず速い", ok: false, note: "どちらが速いかは、行数、ハードウェア、選ばれる結合アルゴリズムといった環境に大きく依存します。" },
    ],
    takeaway: "解2は集約のコストが解1より高くなることがありますが、<b>TEMP落ちさえしなければ十分に元が取れる取引</b>です。最終的には性能試験で判断します。",
  },
  {
    type: "q", sec: "演習問題7", title: "ビューマージが選ばれる理由", ref: "sub", table: ["companies", "shops"],
    prompt: "オプティマイザは、解2（集約が先）のコードに対しても、サブクエリを展開して結合を先に行う計画（ビューマージ）を選ぶことがある。そう判断する理由として、本書の解答に含まれるものはどれ？",
    choices: [
      { text: "結合で結果の行数を大きく減らせる場合や、主キーのインデックスのように効率よくアクセスできる手段がある場合", ok: true, note: "結合で行数が減れば、集約の対象も減ります。本書の解答はほかに、パーティションを使える場合や、列数を大きく減らせる場合（列プルーニング）も挙げています。" },
      { text: "サブクエリの中で集約すると、結果が変わってしまうから", ok: false, note: "計画を入れ替えられるのは、クエリ同士が同値な場合だけです。結果は変わりません。" },
      { text: "SQLの標準で、サブクエリは必ず展開すると決められているから", ok: false, note: "展開するかはオプティマイザの判断です。Oracleでは、MERGEヒントで展開を強制し、NO_MERGEで分離できます。" },
      { text: "集約はインデックスを使えないので、いつでも後に回すほうが速いから", ok: false, note: "集約が先のほうが速い場合があることを、7.2で見ました。" },
    ],
    show: [{ q: "agg_before", tag: "解2：集約が先" }, { q: "agg_after", tag: "解1：結合が先" }],
    takeaway: "PostgreSQL 16とMySQL 8.0は、この解2を書いたとおり集約から実行しました（Subquery Scan、Materialize）。<b>書いたとおりに実行されるとは限らない</b>ので、実行計画で確かめます。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  sub: () => `<div class="grid">
      <div class="col">
        <div class="label">テーブル、ビュー、サブクエリ</div>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th></th><th>永続的か</th><th>データを保持するか</th></tr></thead>
          <tbody>
            <tr><td>テーブル</td><td>する</td><td>する</td></tr>
            <tr><td>ビュー</td><td>する</td><td>しない（アクセスのたびにSELECT文を実行）</td></tr>
            <tr><td>サブクエリ</td><td>しない（SQL文の実行中だけ）</td><td>しない</td></tr>
          </tbody></table></div>
        <div class="label">サブクエリの3つの問題点</div>
        <ul class="points">
          <li><b>計算コスト</b>：アクセスのたびに中身のSELECT文を実行します。</li>
          <li><b>I/Oコスト</b>：結果を保持するために書き込み、量が多いとファイルに書き出します（TEMP落ち）。</li>
          <li><b>最適化</b>：制約やインデックスのメタ情報がなく、最適化を受けられません。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">サブクエリ・パラノイア</div>
        <ul class="points">
          <li>集約したサブクエリを元のテーブルと結合するなど、サブクエリを重ねて問題を解く書き方です。同じテーブルを何度も読み、結合が増えます。</li>
          <li>ウィンドウ関数を使えば、テーブルへのアクセスを1回にまとめ、結合をなくせることが多くあります。</li>
        </ul>
        <div class="label">結合を使うクエリの2つの不安定要因</div>
        <ul class="points">
          <li><b>アルゴリズムの変動リスク</b>：件数が増えて閾値を超えると、Nested LoopsからHashなどに計画が変わります。</li>
          <li><b>環境に起因する遅延リスク</b>：インデックスの有無やワーキングメモリの大きさに性能が左右されます。</li>
        </ul>
        <div class="label">サブクエリを積極的に使う場面</div>
        <ul class="points">
          <li>結合の前に集約して、結合する行数を減らしたいときです。</li>
        </ul>
        <p class="takeaway"><b>1にI/O、2にI/O、3、4がなくて5にI/O。</b>シンプルな実行計画ほど性能が安定します。</p>
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
  h1: "サブクエリ<br>困難は分割するべきか",
  lede: () => `サブクエリの弊害と、ウィンドウ関数による書き換え、サブクエリを積極的に使う場面を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画と結果が表示されます。同じテーブルを何回読んでいるかを数えてください。`,
  points: [
    "サブクエリは困難を分割できる便利な道具だが、結合を増やしてパフォーマンスを悪化させることもある。",
    "SQLのパフォーマンスを決める要因は、1にI/O、2にI/O、3、4がなくて5にI/O。",
    "サブクエリと結合をウィンドウ関数で置き換えると、パフォーマンスを改善できることがある。",
    "サブクエリを使う場合は、結合の対象の行数を事前に絞ることでパフォーマンスを改善できることがある。",
  ],
};
