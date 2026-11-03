const T = {
  omit: { name: "OmitTbl（省略あり）", cols: ["keycol", "seq", "val"], rows: [
    ["A",1,50],["A",2,null],["A",3,null],["A",4,70],["A",5,null],["A",6,900],
    ["B",1,10],["B",2,20],["B",3,null],["B",4,3],["B",5,null],["B",6,null]] },
  omit_filled: { name: "OmitFilled（埋め立て後）", cols: ["keycol", "seq", "val"], rows: [
    ["A",1,50],["A",2,50],["A",3,50],["A",4,70],["A",5,70],["A",6,900],
    ["B",1,10],["B",2,20],["B",3,20],["B",4,3],["B",5,3],["B",6,3]] },
  score_rows: { name: "ScoreRows（行持ち・更新元）", cols: ["student_id", "subject", "score"], rows: [
    ["A001","英語",100],["A001","国語",58],["A001","数学",90],["B002","英語",77],["B002","国語",60],
    ["C003","英語",52],["C003","国語",49],["C003","社会",100]] },
  score_cols: { name: "ScoreCols（列持ち・更新先）", cols: ["student_id", "score_en", "score_nl", "score_mt"], rows: [
    ["A001",null,null,null],["B002",null,null,null],["C003",null,null,null],["D004",null,null,null]] },
  score_cols_nn: { name: "ScoreColsNN（列持ち・NOT NULL）", cols: ["student_id", "score_en", "score_nl", "score_mt"], rows: [
    ["A001",0,0,0],["B002",0,0,0],["C003",0,0,0],["D004",0,0,0]] },
  score_cols2: { name: "ScoreCols2（列持ち・更新元）", cols: ["student_id", "score_en", "score_nl", "score_mt"], rows: [
    ["A001",100,58,90],["B002",77,60,null],["C003",52,49,null],["D004",10,70,100]] },
  score_rows2: { name: "ScoreRows2（行持ち・更新先）", cols: ["student_id", "subject", "score"], rows: [
    ["A001","英語",null],["A001","国語",null],["A001","数学",null],["B002","英語",null],["B002","国語",null],
    ["C003","英語",null],["C003","国語",null],["C003","社会",null]] },
  score_rows_nn: { name: "ScoreRowsNN（行持ち・NOT NULL）", cols: ["student_id", "subject", "score"], rows: [
    ["A001","英語",0],["A001","国語",0],["A001","数学",0],["B002","英語",0],["B002","国語",0],
    ["C003","英語",0],["C003","国語",0],["C003","社会",0]] },
  stocks: { name: "Stocks（株価）", cols: ["brand", "sale_date", "price"], rows: [
    ["A鉄鋼","2008-07-01",1000],["A鉄鋼","2008-07-04",1200],["A鉄鋼","2008-08-12",800],
    ["B商社","2008-06-04",3000],["B商社","2008-09-11",3000],["C電気","2008-07-01",9000],
    ["D産業","2008-06-04",5000],["D産業","2008-06-05",5000],["D産業","2008-06-06",4800],["D産業","2008-12-01",5100]] },
  orders: { name: "Orders（注文）", cols: ["order_id", "order_shop", "order_name", "order_date"], rows: [
    [10000,"東京","後藤信二","2011-08-22"],[10001,"埼玉","佐原商店","2011-09-01"],[10002,"千葉","水原陽子","2011-09-20"],
    [10003,"山形","加地健太郎","2011-08-05"],[10004,"青森","相原酒店","2011-08-22"],[10005,"長野","宮元雄介","2011-08-29"]] },
  order_receipts: { name: "OrderReceipts（注文明細）", cols: ["order_id", "order_receipt_id", "item_group", "delivery_date"], rows: [
    [10000,1,"食器","2011-08-24"],[10000,2,"菓子詰め合わせ","2011-08-25"],[10000,3,"牛肉","2011-08-26"],
    [10001,1,"魚介類","2011-09-04"],[10002,1,"菓子詰め合わせ","2011-09-22"],[10002,2,"調味料セット","2011-09-22"],
    [10003,1,"米","2011-08-06"],[10003,2,"牛肉","2011-08-10"],[10003,3,"食器","2011-08-10"],
    [10004,1,"野菜","2011-08-23"],[10005,1,"飲料水","2011-08-30"],[10005,2,"菓子詰め合わせ","2011-08-30"]] },
};

const OMIT_NOTE = "主キーは(keycol, seq)です。valがNULLの行は、同じkeycolで1つ前の行と同じ値なので省略されています。";
const FILLED_NOTE = "本書は埋め立て後のOmitTblを出発点にします。このドリルでは別の表OmitFilledにしています。";
const SCORE_NOTE = "主キーはScoreRowsが(student_id, subject)、ScoreColsがstudent_idです。D004はScoreRowsにいません。";
const NN_NOTE = "ScoreColsNNは3つの点数の列がNOT NULLで、初期値は0です。";
const SCORE2_NOTE = "本書は9.3でScoreColsとScoreRowsの中身を入れ替えます。このドリルでは別の表ScoreCols2とScoreRows2にしています。";
const EX9_NOTE = "本書の演習問題9の表です。score列がNOT NULLで、初期値は0です。更新元はScoreCols2です。";
const STOCKS_NOTE = "主キーは(brand, sale_date)です。Stocks2は同じ列にtrend（CHAR(3)）を足した空の表です。";
const ORDERS_NOTE = "主キーはOrdersがorder_id、OrderReceiptsが(order_id, order_receipt_id)です。1件の注文に複数の明細があります。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "plan", title: "更新文の実行計画を読む" },
  { type: "intro", id: "fill", title: "NULLの埋め立てと逆演算" },
  { type: "intro", id: "rowcol", title: "行と列の変換" },
  { type: "intro", id: "trend", title: "同じテーブルの別の行から更新" },
  { type: "intro", id: "model", title: "スーパーソルジャー病" },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "NULLを直前の値で埋める", ref: "fill", table: ["omit"], tableNote: OMIT_NOTE,
    prompt: "OmitTblのNULLを、同じkeycolで直前にある、NULLでない値で埋めたい。1つのUPDATE文で、すべてのNULLを正しく埋めるのはどれ？",
    choices: [
      { q: "fill_lag", tag: "LAGで1行前の値", ok: false, note: "1行前がNULLだと、NULLのまま残ります。Aのseq 3とBのseq 6が埋まりません（結果タブ）。UPDATE文は更新前の値を読むので、seq 2を埋めた値は使われません。" },
      { q: "fill_no_notnull", tag: "val IS NOT NULLの条件なし", ok: false, note: "自分より小さい最大のseq、つまり1行前を探しているだけです。LAGと同じく、NULLが2行続くと2行目が埋まりません。" },
      { q: "fill_corr", tag: "本書の相関サブクエリ", ok: true, note: "同じkeycol、自分より小さいseq、valがNULLでない、の3つの条件で行を絞り、その中で最大のseqを持つ行の値を取ります。NULLが続いていても、値のある行まで遡れます。" },
    ],
    takeaway: "<b>「NULLでない行に限る」という条件があるから、NULLの連続を飛び越えて遡れる。</b>1行ずつ回すぐるぐる系にしなくても、1つのUPDATE文で全行を埋められます。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "相関サブクエリは何回動いたか", ref: "plan", table: ["omit"], tableNote: OMIT_NOTE,
    prompt: "本書の相関サブクエリの解を、PostgreSQLで実行した。実行計画のSubPlan 2（OT1を読むサブクエリ）は何回実行された？",
    choices: [
      { text: "1回", ok: false, note: "相関サブクエリは外側の行の値（OmitTbl.keycolとseq）を使うので、更新する行ごとに実行します。" },
      { text: "2回（keycolごと）", ok: false, note: "PostgreSQLは同じkeycolの結果を使い回しません。" },
      { text: "6回", ok: true, note: "Seq Scan on omittblのFilter: (val IS NULL)で12行から6行に絞り、その6行ごとにSubPlan 2とInitPlan 1（MAX(seq)の集約）をloops=6で実行しています。" },
      { text: "12回", ok: false, note: "外側のWHERE val IS NULLで、更新するのは6行だけです。全12行で実行するのは、WHERE句のない逆演算の解です（loops=12）。" },
    ],
    show: [{ q: "fill_corr", tag: "埋め立て（相関サブクエリ）" }, { q: "rev_corr", tag: "逆演算（相関サブクエリ）" }],
    takeaway: "<b>相関サブクエリのUPDATEは、更新する行の数だけサブクエリを実行する。</b>本書のOracleの計画では、内側の2つのサブクエリが主キーのインデックスを使っています。PostgreSQLも、行数が増えればインデックスを使う計画になる可能性があります。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "MySQLで同じUPDATE文を実行する", ref: "fill", table: ["omit"], db: "my",
    prompt: "本書の相関サブクエリの解を、MySQL 8.0でそのまま実行した。どうなった？",
    choices: [
      { text: "PostgreSQLと同じように、6行を埋めた", ok: false, note: "実行計画タブのとおり、エラーになりました。" },
      { text: "ERROR 1093（更新先のテーブルをFROM句で指定できない）になった", ok: true, note: "MySQLは、UPDATE文のサブクエリの中で、更新先と同じテーブルを読むことを許していません。本書によると、主要なDBMSでこの制限があるのはMySQLだけです。" },
      { text: "相関サブクエリはSET句に書けないので、構文エラーになった", ok: false, note: "SET句の相関サブクエリ自体は、MySQLでも書けます。9.3の列から行への更新のように、別のテーブルを読むなら動きます。" },
      { text: "1行ずつ処理されて、seq 3も直前に埋めた値で埋まった", ok: false, note: "エラーで1行も更新されません。そもそもUPDATE文は、更新前の状態を読んで計算します。" },
    ],
    show: [{ q: "fill_corr", tag: "相関サブクエリ" }],
    takeaway: "本書は注で、<b>サブクエリを導出テーブルとして実体化すればERROR 1093を回避できる</b>と述べつつ、可読性が悪いので勧めていません。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "IGNORE NULLS", ref: "fill", table: ["omit"],
    prompt: "本書は、FIRST_VALUE(val) IGNORE NULLSというウィンドウ関数で、相関サブクエリをなくす解も示す。PostgreSQL 16とMySQL 8.0で、このSELECTを実行するとどうなった？",
    choices: [
      { text: "どちらでも、NULLを飛ばした値が返った", ok: false, note: "実行計画タブのとおり、どちらもエラーです。" },
      { text: "PostgreSQLは構文エラー、MySQLは未対応のエラーになった", ok: true, note: "PostgreSQLは「syntax error at or near \"NULLS\"」、MySQLは「This version of MySQL doesn't yet support 'IGNORE NULLS'」で止まりました。本書のとおり、主要なDBMSではOracleやSQL Serverでしか使えません。" },
      { text: "PostgreSQLだけが動いた", ok: false, note: "PostgreSQL 16は、IGNORE NULLSに対応していません。" },
      { text: "どちらも、NULLをそのまま返した", ok: false, note: "オプションを無視して実行することはなく、エラーになります。" },
    ],
    show: [{ q: "fill_ignore", tag: "IGNORE NULLS" }],
    takeaway: "本書のOracleの計画では、<b>IGNORE NULLSを使うと相関サブクエリが消え、OmitTblへのアクセスが減ります</b>（WINDOW SORTとHASH JOIN OUTER）。便利なオプションですが、使えるDBMSが限られます。なお、既定のフレーム（パーティションの先頭から現在行まで）では、FIRST_VALUEはパーティションで最初のNULLでない値を返すので、Aのseq 5が70ではなく50になります。<b>直前の値で埋めるなら、LAST_VALUE(val) IGNORE NULLSが正しい</b>と考えられます。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "逆にNULLを作る", ref: "fill", table: ["omit_filled"], tableNote: FILLED_NOTE,
    prompt: "埋め立て後の表から、省略された元の表に戻すUPDATE文は、CASE式の比較の中にサブクエリを丸ごと書いている。こう書けるのはなぜ？",
    code: "SET val = CASE WHEN val = (SELECT val FROM OmitFilled O1 WHERE ...)\n               THEN NULL\n               ELSE val END",
    choices: [
      { text: "サブクエリが値を1つだけ返すスカラサブクエリだから", ok: true, note: "スカラサブクエリは1つの値として扱えるので、式を書ける場所ならどこにでも書けます。1つ前の行と同じ値ならNULLに、違えば元の値のままにします。" },
      { text: "CASE式の中では、サブクエリが複数行を返してもよいから", ok: false, note: "複数行を返すとエラーになります。主キー(keycol, seq)で1行に絞っているので、1つの値になります。" },
      { text: "UPDATE文のSET句では、どんなサブクエリもCASE式で包む必要があるから", ok: false, note: "埋め立ての解のように、SET句にサブクエリを直接書くこともできます。" },
      { text: "CASE式がサブクエリを1回だけ実行して、結果を使い回すから", ok: false, note: "相関サブクエリなので、行ごとに実行します。PostgreSQLの計画ではloops=12です。" },
    ],
    show: [{ q: "rev_corr", tag: "逆演算（相関サブクエリ）" }],
    takeaway: "<b>サブクエリを丸ごとCASE式の条件に入れて、相関サブクエリのように使う。</b>本書が、UPDATE文で非常に重要だと強調するテクニックです。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "LAGで書き換えた逆演算の計画", ref: "fill", table: ["omit_filled"], tableNote: FILLED_NOTE,
    prompt: "逆演算を、共通表式（WITH句）の中のLAG関数で書き換えた。PostgreSQLの実行計画で、WindowAgg（LAGの計算）は何回実行された？",
    choices: [
      { text: "1回。表を1回並べて全行のLAGを計算し、それを使い回した", ok: false, note: "そうなっていれば理想的ですが、WindowAggはSubPlan 1の下にあります。" },
      { text: "2回。keycolごとに1回ずつ計算した", ok: false, note: "計算するのはkeycolが同じ6行ずつですが、回数は更新する行の数です。" },
      { text: "12回。更新する行ごとに、同じkeycolの6行を並べ直して計算した", ok: true, note: "WindowAggとSortにloops=12とあります。PostgreSQLは共通表式をサブクエリに展開し、Filter: (keycol = omitfilled.keycol)を内側に持ち込んだので、行ごとにOmitFilledを読んで並べ直しています。" },
      { text: "0回。LAGは計算しなくても、主キーの1つ前の行を読むだけで済んだ", ok: false, note: "Sortの上にWindowAggがあり、LAGを計算しています。" },
    ],
    show: [{ q: "rev_lag", tag: "逆演算（LAG）" }, { q: "rev_corr", tag: "逆演算（相関サブクエリ）" }],
    takeaway: "LAGを使うと、MAX(seq)を求めるサブクエリは消えます。それでも<b>SET句のスカラサブクエリから参照する限り、行ごとに計算する計画になりうる。</b>第8章のROW_NUMBERによる更新と同じ構図です。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "逆演算をMySQLで", ref: "fill", table: ["omit_filled"], tableNote: FILLED_NOTE, db: "my",
    prompt: "逆演算の2つの解を、MySQL 8.0で実行した。エラーにならず、正しく元の表に戻ったのはどれ？",
    choices: [
      { q: "rev_corr", tag: "相関サブクエリ", ok: false, note: "埋め立ての解と同じく、ERROR 1093で止まります。サブクエリの中で、更新先のOmitFilledを読んでいるからです。" },
      { q: "rev_lag", tag: "共通表式のLAG", ok: true, note: "MySQLでも動き、結果はPostgreSQLと同じでした。ウィンドウ関数を含む共通表式は外側の文にマージできないので、MySQLは一時テーブルに実体化してから読みます。そのため、更新先のテーブルを直接読んだことにならない、と考えられます。本書も、この解はMySQLで動くと述べています。" },
      { text: "どちらもERROR 1093になる", ok: false, note: "共通表式のLAGを使った解は動きました。" },
    ],
    takeaway: "<b>参照元を一度実体化すれば、MySQLの自己参照の制限を避けられる。</b>本書が注で触れている、導出テーブルで回避するテクニックと同じ考え方です。MySQLは、WHERE句にサブクエリのない1テーブルのUPDATE文の計画を表示しないので、計画では確かめられません。",
  },
  {
    type: "q", sec: "9.2 行から列への更新", title: "3教科をまとめて更新する", ref: "rowcol", table: ["score_rows", "score_cols"], tableNote: SCORE_NOTE,
    prompt: "ScoreRowsの点数を、ScoreColsの英語・国語・数学の列に移したい。正しく更新し、かつScoreRowsを読むサブクエリが1つで済むのはどれ？",
    choices: [
      { q: "cols_each", tag: "1列ずつ相関サブクエリ", ok: false, note: "本書が「素直だけど非効率」と呼ぶ解です。結果は正しいものの、SubPlan 1〜3の3つがそれぞれloops=4で、ScoreRowsを3系統で読んでいます。教科が増えると、サブクエリも増えます。" },
      { q: "cols_row_nomax", tag: "行式（MAXなし）", ok: false, note: "「more than one row returned by a subquery used as an expression」というエラーです。生徒ごとにScoreRowsの行が複数あるので、サブクエリが複数行を返します。" },
      { q: "cols_row", tag: "行式（MAXあり）", ok: true, note: "SET句の左辺を(score_en, score_nl, score_mt)と行式にし、1つのサブクエリで3列を返します。計画はSubPlan 1 (returns $1,$2,$3)の1つだけです。" },
    ],
    takeaway: "<b>行式を使えば、更新する列が増えてもサブクエリの数は増えない。</b>代わりに集約（Aggregate）が加わりますが、1人の教科数は少ないので、テーブルへのアクセスを減らす効果が勝ります。MySQL 8.0はSET句の行式に対応しておらず、構文エラーになります（実行計画タブのMySQL）。",
  },
  {
    type: "q", sec: "9.2 行から列への更新", title: "行式の中のMAX", ref: "rowcol", table: ["score_rows"], tableNote: SCORE_NOTE,
    prompt: "行式の解から外側のMAXを外すと、エラーになった。生徒A001について、score_enのCASE式だけを書いたサブクエリは何を返す？",
    code: "SELECT CASE WHEN subject = '英語' THEN score ELSE NULL END\n  FROM ScoreRows SR\n WHERE SR.student_id = 'A001'",
    choices: [
      { text: "100の1行", ok: false, note: "WHERE句で絞っているのは生徒だけで、教科は絞っていません。" },
      { text: "100、NULL、NULLの3行", ok: true, note: "A001の英語・国語・数学の3行それぞれについて、CASE式を評価します。英語以外の2行はELSEでNULLになります。MAXはNULLを無視するので、3行を100という1つの値にまとめられます。" },
      { text: "NULLの1行", ok: false, note: "英語の行があるので、100を含みます。" },
      { text: "0行", ok: false, note: "A001の行は3行あります。" },
    ],
    show: [{ q: "cols_row_nomax", tag: "行式（MAXなし）" }, { q: "cols_row", tag: "行式（MAXあり）" }], showDefault: 1,
    takeaway: "<b>MAXは最大値を求めるためではなく、複数の行を1つの値にたたむために使っている。</b>第4章の、集約関数の中にCASE式を書いて行を列に変換する技法と同じです。",
  },
  {
    type: "q", sec: "9.2 行から列への更新", title: "NOT NULLの列への更新", ref: "rowcol", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "行式の解（COALESCEなし）を、NOT NULL制約の付いたScoreColsNNに対して実行した。PostgreSQLは、どの行の値で止まった？",
    choices: [
      { text: "D004（ScoreRowsに1行もない生徒）", ok: false, note: "D004も3列がNULLになるので違反しますが、PostgreSQLが先に処理したのはB002です。" },
      { text: "B002の数学（生徒はいるが、その教科の行がない）", ok: true, note: "「null value in column \"score_mt\" ... Failing row contains (B002, 77, 60, null)」です。B002には数学の行がないので、MAXの結果がNULLになります。" },
      { text: "C003の社会（ScoreColsNNに列がない教科）", ok: false, note: "社会はCASE式のどの列にも当たらないので、無視されるだけです。" },
      { text: "エラーにならず、NULLは0に置き換わった", ok: false, note: "NULLを0に置き換える処理は書いていません。" },
    ],
    show: [{ q: "nn_row_plain", tag: "行式（COALESCEなし）" }],
    takeaway: "本書は、NULLが生じる場面を2つのレベルに分けます。<b>そもそも生徒がいない（D004）場合と、生徒はいるが教科が欠けている（B002とC003の数学）場合です。</b>前者をEXISTSで、後者をCOALESCEで防ぎます。",
  },
  {
    type: "q", sec: "9.2 行から列への更新", title: "EXISTSを外すと", ref: "rowcol", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "NOT NULLに対応した行式の解から、外側のWHERE EXISTS（ScoreRowsに生徒がいる行に限る）を外した。PostgreSQLではどうなった？",
    choices: [
      { text: "D004の行でNOT NULL違反のエラーになった", ok: false, note: "エラーにはなりませんでした。結果タブのとおり、UPDATE 4です。" },
      { text: "エラーにならず、D004の3列も0で更新された", ok: true, note: "GROUP BYのない集約は、対象が0行でも1行を返します。D004ではMAXがNULLになり、それをCOALESCEが0にするので、D004も0で上書きされます。" },
      { text: "D004は自動的に更新対象から外れた", ok: false, note: "WHERE句がないので、全4行が更新対象です。EXISTS付きはUPDATE 3、外すとUPDATE 4です。" },
      { text: "構文エラーになった", ok: false, note: "WHERE句は省略できます。" },
    ],
    show: [{ q: "nn_row_noexists", tag: "EXISTSなし" }, { q: "nn_row", tag: "EXISTSあり" }],
    takeaway: "このデータではD004の初期値も0なので、見た目は変わりません。<b>EXISTSが防いでいるのはエラーよりも、更新元にいない行を0で上書きしてしまうこと</b>です。D004に別の値が入っていたら消えてしまいます。PostgreSQLの計画では、EXISTSがHashAggregateとHash Joinになって加わっています（本書のOracleではHASH JOIN SEMI）。",
  },
  {
    type: "q", sec: "9.2 行から列への更新", title: "本書のMERGE文をPostgreSQLで", ref: "rowcol", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "本書は、MERGE文で複数列を更新する解を「Oracle、Db2でのみ利用可能」としている。本書のリストをPostgreSQL 16でそのまま実行するとどうなった？",
    choices: [
      { text: "MERGE文に対応していないので、構文エラーになった", ok: false, note: "PostgreSQLはバージョン15からMERGE文に対応しています（SQL Serverも2008から対応しています）。MERGE文そのものは動きます。" },
      { text: "SET句の列名に表名（ScoreColsNN.）を付けているので、エラーになった", ok: true, note: "「column \"scorecolsnn\" of relation \"scorecolsnn\" does not exist」です。PostgreSQLのMERGE文では、更新する列の名前に表名を付けられません。表名を外すと動き、結果は行式の解と同じでした。" },
      { text: "そのまま動き、D004も含めて4行を更新した", ok: false, note: "そのままではエラーです。表名を外した版も、ONで一致しないD004は更新せず、MERGE 3でした。" },
      { text: "NOT NULL違反のエラーになった", ok: false, note: "COALESCEで0にしているので、NOT NULLには違反しません。" },
    ],
    show: [{ q: "merge_book", tag: "本書のまま" }, { q: "merge_fix", tag: "列名の表名を外す" }],
    takeaway: "<b>MERGE文は、PostgreSQL 15以降でも使える。</b>ただし構文には実装ごとの違いが残ります。MySQL 8.0はMERGE文に対応していません。",
  },
  {
    type: "q", sec: "9.2 行から列への更新", title: "MERGE文を使う利点", ref: "rowcol", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "UPDATE文の代わりにMERGE文を使う利点として、本書が挙げるものはどれ？",
    choices: [
      { text: "UPDATE文では、SET句のサブクエリとWHERE句のEXISTSの2か所に散らばる結合条件を、ON句の1か所にまとめられる", ok: true, note: "2か所にあると、片方だけを直して、もう一方を直し忘れるミスを招きやすくなります。性能面でも、ScoreRowsを1回読んで集約し、1回結合するだけで済みます（PostgreSQLの計画もHashAggregateとHash Joinが1つずつです）。" },
      { text: "MERGE文は、全行をロックせずに更新できる", ok: false, note: "本書が挙げている利点ではありません。" },
      { text: "MERGE文は標準SQLではないが、どのDBMSでも同じ構文で書ける", ok: false, note: "MERGE文はSQL:2003で標準に入りました。前の問題のとおり、構文には実装ごとの違いがあります。" },
      { text: "MERGE文なら、更新先にいない生徒（D004）も自動的に追加される", ok: false, note: "追加するにはWHEN NOT MATCHED THEN INSERTを書く必要があります。本書の解はWHEN MATCHEDだけです。" },
    ],
    show: [{ q: "merge_fix", tag: "MERGE文" }, { q: "nn_row", tag: "UPDATE文（行式）" }, { q: "nn_each", tag: "UPDATE文（1列ずつ）" }],
    takeaway: "MERGE文は、もともとUPDATEとINSERTを一度に行うための構文です。<b>UPDATEだけを書いてもよい、という点を利用したトリック</b>です。",
  },
  {
    type: "q", sec: "演習問題9", title: "列から行へ、NOT NULLの列に", ref: "rowcol", table: ["score_cols2", "score_rows_nn"], tableNote: EX9_NOTE,
    prompt: "ScoreCols2の点数を、score列がNOT NULLのScoreRowsNNに移したい。PostgreSQLでエラーにならず、正しく更新できるのはどれ？",
    choices: [
      { q: "ex9_plain", tag: "9.3の解のまま", ok: false, note: "C003の社会は、CASE式のどのWHENにも当たらずNULLになります。「Failing row contains (C003, 社会, null)」で止まりました。" },
      { q: "ex9_exists", tag: "WHERE EXISTSを足す", ok: false, note: "同じエラーです。C003はScoreCols2にいるので、EXISTSでは除外されません。欠けているのは生徒ではなく教科です。MySQLも結果タブのとおり、ERROR 1048で止まります（MySQLの実行計画タブには計画だけが表示されます）。" },
      { q: "ex9_coalesce", tag: "CASE式をCOALESCEで包む", ok: true, note: "本書の解答です。NULLを0に変えるので、C003の社会は0になります。計画は9.3の解と同じで、SubPlanのloops=8です。" },
    ],
    show: [{ q: "ex9_plain", tag: "9.3の解のまま" }, { q: "ex9_exists", tag: "WHERE EXISTSを足す" }, { q: "ex9_coalesce", tag: "COALESCEで包む" }, { q: "rows_case", tag: "9.3の解（NULL可の表）" }],
    takeaway: "<b>欠けているのが行（生徒）ならEXISTS、列（教科）ならCOALESCE。</b>9.2で見た2つのレベルの区別が、ここでも効きます。本書によると、COALESCEはサブクエリの外側に書いても、計画は変わりません。",
  },
  {
    type: "q", sec: "9.4 同じテーブルの異なる行からの更新", title: "株価のトレンドを計算する", ref: "trend", table: ["stocks"], tableNote: STOCKS_NOTE,
    prompt: "銘柄ごとに直前の取引日の終値と比べ、trend（↑、↓、→）を計算してStocks2にINSERTしたい。正しいtrendを入れ、かつStocksを1回しか読まないのはどれ？",
    choices: [
      { q: "trend_corr", tag: "相関サブクエリ", ok: false, note: "結果は正しいものの、PostgreSQLの計画ではStocksを3系統で読んでいます。SubPlan 2とInitPlan 1（MAX(sale_date)）がloops=10です。" },
      { q: "trend_nopart", tag: "PARTITION BYなし", ok: false, note: "銘柄の区切りがないので、B商社の最初の行が、A鉄鋼の最後の800と比べられて↑になります。C電気（↑）とD産業（↓）の最初の行も、前の銘柄の終値と比べられています（結果タブ）。" },
      { q: "trend_window", tag: "PARTITION BY brand", ok: true, note: "ROWS BETWEEN 1 PRECEDING AND 1 PRECEDINGで、銘柄ごとに1行前の終値を取ります。Seq Scan on stocksは1つで、brandとsale_dateでSortしてからWindowAggで計算します。" },
    ],
    takeaway: "各銘柄の最初の行は1行前がないので、引き算がNULLになり、CASE式のELSEでtrendもNULLです。<b>行間比較の相関サブクエリは、ウィンドウ関数で1回のスキャンに置き換えられる。</b>MySQL 8.0では、本書の図9.28と違って、相関サブクエリの解でもINSERT SELECTの計画を表示できました（実行計画タブのMySQL）。",
  },
  {
    type: "q", sec: "9.4 同じテーブルの異なる行からの更新", title: "INSERT、UPDATE、ビュー", ref: "trend", table: ["stocks"], tableNote: STOCKS_NOTE,
    prompt: "trendを持たせる方法には、別テーブルへのINSERT SELECT、Stocks自体へのUPDATE、Stocks2をビューにする方法がある。本書の評価として正しくないのはどれ？",
    choices: [
      { text: "INSERT SELECTは、MySQLのように更新のSQLでの自己参照を許さないDBMSでも使える", ok: false, note: "本書の評価のとおりです。参照元と更新先が別のテーブルなので、ERROR 1093になりません。" },
      { text: "INSERT SELECTは、UPDATEより性能を改善する手段が多く用意されている", ok: false, note: "本書の評価のとおりです。" },
      { text: "ビューは、アクセスするたびに計算し直すので常に最新だが、検索の性能は最も悪い", ok: false, note: "本書の評価のとおりです。即時性と性能のトレードオフです。" },
      { text: "INSERT SELECTは、ストレージの消費がUPDATEと変わらない", ok: true, note: "誤りです。ほぼ同じ構造のテーブルを2つ持つので、ストレージの消費はほぼ2倍になります。本書は、ストレージが安くなった今ではあまり大きな欠点ではないが、巨大なテーブルでは注意が必要だと述べています。" },
    ],
    show: [{ q: "trend_window", tag: "INSERT SELECT（ウィンドウ関数）" }, { q: "trend_corr", tag: "INSERT SELECT（相関サブクエリ）" }],
    takeaway: "<b>実テーブルを更新すれば検索は速いが、元のデータとの同期にタイムラグが生まれる。</b>この性能と即時性のトレードオフが、次の節のテーマです。",
  },
  {
    type: "q", sec: "9.5 更新のもたらすトレードオフ", title: "注文者名義のMAX", ref: "model", table: ["orders", "order_receipts"], tableNote: ORDERS_NOTE,
    prompt: "本書は、注文ごとの最大の遅延日数を求めるとき、order_nameをMAX(O.order_name)と書く理由を「GROUP BY句にない列を裸で書くとエラーになるから」と説明する。order_nameを裸で書いて、PostgreSQL 16とMySQL 8.0で実行すると、どうなった？",
    choices: [
      { text: "どちらもエラーになった", ok: false, note: "結果タブのとおり、どちらも3行を返しました。" },
      { text: "どちらも動き、MAXを付けたときと同じ3行を返した", ok: true, note: "GROUP BYのキーO.order_idはOrdersの主キーなので、order_nameはorder_idで1つに決まります（関数従属）。PostgreSQLも、ONLY_FULL_GROUP_BYが有効なMySQLも、この場合は裸の列を許します。" },
      { text: "PostgreSQLは動いたが、MySQLはONLY_FULL_GROUP_BYのエラーになった", ok: false, note: "MySQL 8.0も、主キーへの関数従属を認めて実行しました。" },
      { text: "動いたが、order_nameに別の注文の名義が混ざった", ok: false, note: "order_idで1つに決まる値なので、混ざりません。" },
    ],
    show: [{ q: "late_bare", tag: "order_nameを裸で書く" }, { q: "late_agg", tag: "MAX(O.order_name)" }, { q: "late_join", tag: "集約前の結合" }],
    takeaway: "主キーで集約したときに裸の列を許すかは、実装によります（Oracleはエラーにします）。<b>どのDBMSでも動かすなら、MAXやMINで包むか、GROUP BYにorder_nameも加える。</b>本書は注で、値を気にしないときに使えるANY_VALUE関数も紹介しています。",
  },
  {
    type: "q", sec: "9.5 更新のもたらすトレードオフ", title: "SQLに頼らずに解く", ref: "model", table: ["orders", "order_receipts"], tableNote: ORDERS_NOTE,
    prompt: "受付日から配送予定日まで3日以上かかる注文を探したい。結合と集約のSQLを書く代わりに、本書が示す「コロンブスの卵」の解はどれ？",
    choices: [
      { text: "Ordersに配送遅延フラグの列を追加し、検索はそのフラグだけを条件にする", ok: true, note: "遅延の有無を注文の行に持たせれば、検索のクエリは結合も集約もいらなくなります。結合による実行計画の変動リスクもなくなります。" },
      { text: "OrderReceiptsのdelivery_dateにインデックスを作る", ok: false, note: "SQLのチューニングで、問題の解き方は変わりません。" },
      { text: "結合をウィンドウ関数に書き換える", ok: false, note: "SQLの書き方を変えるだけで、結合も残ります。" },
      { text: "OrdersとOrderReceiptsを1つのテーブルにまとめる", ok: false, note: "本書が示す解ではありません。注文と明細の一対多の関係は、そのままにします。" },
    ],
    show: [{ q: "late_agg", tag: "SQLで解く（結合と集約）" }],
    takeaway: "問題を前にして反射的にSQLを書き始めるのは、<b>スーパーソルジャー病</b>という一種の視野狭窄です。「金槌しか持たない人には、すべての問題が釘に見える」（マズロー）。",
  },
  {
    type: "q", sec: "9.6 モデル変更の注意点", title: "モデル変更のトレードオフ", ref: "model",
    prompt: "配送遅延フラグを追加するモデル変更にも、トレードオフがある。本書が挙げていないのはどれ？",
    choices: [
      { text: "検索の負荷を更新に押し付けるので、更新コストが高まる", ok: false, note: "本書が挙げています。登録時にフラグが決まらなければ、あとでUPDATEが要ります。" },
      { text: "明細の配送予定日とフラグの間に、同期が取れていない時間帯（タイムラグ）が生まれる", ok: false, note: "本書が挙げています。夜間バッチで一括更新すると長くなり、完全なリアルタイム性を求めると同じトランザクションで処理する必要があって、性能に響きます。" },
      { text: "あとからのモデル変更は手戻りが大きく、ほかの処理にも副作用が出るおそれがある", ok: false, note: "本書が挙げています。商用運用に入ってからの変更は、もう現実的ではありません。" },
      { text: "フラグの列を足すと、Ordersの主キーを変更しなければならない", ok: true, note: "本書が挙げていません。フラグは普通の列として追加するだけで、主キーは変わりません。" },
    ],
    takeaway: "本書の3つのトレードオフは、<b>更新コスト、更新までのタイムラグ、モデル変更のコスト</b>です。モデリングは、事前にあらゆる要因を想定しておかないと、あとで問題を引き起こすホットスポットです。",
  },
  {
    type: "q", sec: "9.7 スーパーソルジャー病：類題", title: "注文ごとの商品数", ref: "model", table: ["orders", "order_receipts"], tableNote: ORDERS_NOTE,
    prompt: "注文ごとの商品数を、集約関数の解（GROUP BY）とウィンドウ関数の解（COUNT(*) OVERとDISTINCT）で求めた。本書の評価と、PostgreSQLの計画として正しいのはどれ？",
    choices: [
      { text: "本書は可読性と拡張性からウィンドウ関数の解を好むが、PostgreSQLの計画では、ウィンドウ関数の解のほうがSortとWindowAggの分だけ手順が多い", ok: true, note: "どちらもHash Joinで結合します。集約関数の解はHashAggregateだけですが、ウィンドウ関数の解はSort、WindowAgg、DISTINCTのためのHashAggregateが続きます。本書は実行コストをほぼ同じと見て、別の観点で比べています。" },
      { text: "本書は性能からウィンドウ関数の解を好み、PostgreSQLの計画でも、ウィンドウ関数の解は結合をなくしてOrderReceiptsだけを読む", ok: false, note: "order_nameとorder_dateはOrdersにあるので、どちらの解もHash Joinで結合します。本書も、性能はほぼ同じと見ています。" },
      { text: "本書は可読性から集約関数の解を好み、PostgreSQLの計画でも、集約関数の解のほうがSortとWindowAggの分だけ手順が多い", ok: false, note: "本書は、やりたいことを素直に表せる点と、商品別の結果にも対応できる点から、ウィンドウ関数の解を好みます。手順が多いのも、集約関数の解ではなくウィンドウ関数の解です。" },
      { text: "本書はどちらでも同じと評価し、PostgreSQLの計画も、2つの解でまったく同じになる", ok: false, note: "本書はウィンドウ関数の解を好みます。PostgreSQLの計画も、ウィンドウ関数の解にはSortとWindowAggが加わり、同じではありません。" },
    ],
    show: [{ q: "cnt_agg", tag: "集約関数" }, { q: "cnt_window", tag: "ウィンドウ関数" }],
    takeaway: "MySQLではどちらもNested Loopで結合し、ウィンドウ関数の解には重複を除く一時テーブルが加わります。そしてここでも、<b>Ordersに商品数の列を持たせるモデル変更</b>が考えられます。",
  },
  {
    type: "q", sec: "9.7 スーパーソルジャー病：類題", title: "商品数の列と遅延フラグの違い", ref: "model",
    prompt: "Ordersに商品数（item_count）の列を足すモデル変更は、配送遅延フラグを足す場合より更新コストの面で有利だ。本書が挙げる理由はどれ？",
    choices: [
      { text: "商品数は普通、注文を登録する時点でわかるので、INSERT文の中に吸収できる", ok: true, note: "遅延フラグは、配送予定日があとで決まると、あとからUPDATEする必要があります。商品数は登録時に入れられるので、更新コストはほとんど上がりません。" },
      { text: "商品数は数値なので、フラグより小さい容量で済む", ok: false, note: "容量の問題ではありません。いつ値が決まるかの問題です。" },
      { text: "商品数はあとから変わることがないので、同期の問題が一切起きない", ok: false, note: "本書は、登録した注文をあとから変更する場合には商品数も直す必要があり、同じ同期の問題を考える必要があると注意しています。" },
      { text: "商品数ならインデックスが要らないから", ok: false, note: "本書が挙げる理由ではありません。" },
    ],
    takeaway: "<b>データモデルがコードを決めるのであって、その逆ではない。</b>本書はレイモンドの「賢いデータ構造と間抜けなコードのほうが、その逆よりずっとまし」を引き、テーブル設計は最初が肝心だと結びます。",
  },
  { type: "end" },
];

// 基礎スライド用の小さな表。セルは値か { v, k, n }。k は ok（埋まる・正しい）、ng（NULLになる・問題）、acc（注目）
const TONE = { ok: "var(--ok-soft)", ng: "var(--ng-soft)", acc: "var(--accent-soft)" };
function vt(cols, rows) {
  const td = c => {
    const o = c !== null && typeof c === "object" ? c : { v: c };
    const style = o.k ? ` style="background:${TONE[o.k]};font-weight:600"` : "";
    if (o.v === null) return `<td class="null"${style}>NULL${o.n ? `　${o.n}` : ""}</td>`;
    const cls = typeof o.v === "number" ? ` class="num"` : "";
    return `<td${cls}${style}>${o.v}${o.n ? `<span style="color:var(--muted);font-weight:400">　${o.n}</span>` : ""}</td>`;
  };
  return `<div class="tbl-wrap" style="max-height:none"><table>
    <thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(td).join("")}</tr>`).join("")}</tbody></table></div>`;
}

const INTRO_BODY = {
  plan: () => {
    const r = analyze(D.cols_each.pg, "pg");
    return `<p class="takeaway" style="margin:0 0 14px"><b>この章の主張は2つ。</b>❶ 更新は、1行ずつ回すループではなく1つのSQL文で書ける（9.1〜9.4）。❷ そもそもSQLで頑張る前に、テーブルの形を変えれば簡単に解けないか考える（9.5〜9.8）。❶の良し悪しは、実行計画でサブクエリが何回動いたか（loops）で確かめます。</p>
    <div class="grid">
      <div class="col">
        <div class="label">更新文の実行計画で見るところ（PostgreSQL）</div>
        ${vt(["ノード", "意味"], [
          ["Update on、Insert on、Merge on", "どのテーブルを更新するか"],
          ["その下のSeq ScanとFilter", "更新する行（WHERE句）"],
          [{ v: "SubPlan（loops=N）", k: "acc" }, "SET句のサブクエリ。N回実行した"],
          ["InitPlan", "親の行に依存しないサブクエリ"],
          ["Sort＋WindowAgg", "ウィンドウ関数"],
        ])}
        <p class="hint">MySQL 8.0のEXPLAIN ANALYZEは、WHERE句にサブクエリのない1テーブルのUPDATE文の計画を表示しません。このドリルの更新は、すべてロールバックしています。</p>
      </div>
      <div class="col">
        <div class="label">例：3教科を1列ずつ更新するUPDATE文</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>更新先のScoreColsを読む（4行）。</li>
          <li>その4行それぞれで、SubPlan 1〜3を実行する（loops=4）。<b>SET句のサブクエリが3つなら、ScoreRowsを読む系統も3つ。</b></li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
  fill: () => `<p class="takeaway" style="margin:0 0 14px"><b>同じkeycolの「前の行」を相関サブクエリで見れば、NULLを埋めるのも戻すのも1つのUPDATE文で書ける。</b>埋めるときの肝は「valがNULLでない行に限る」条件で、これがあるからNULLが続いても値のある行まで遡れます。</p>
    <div class="grid">
      <div class="col">
        <div class="label">NULLを埋める（keycol = Aの6行）</div>
        ${vt(["seq", "更新前のval", "値を取りに行く行", "更新後のval"], [
          [1, 50, "", 50],
          [2, null, "seq 1", { v: 50, k: "ok" }],
          [3, null, { v: "seq 1（seq 2はNULLなので飛ばす）", k: "acc" }, { v: 50, k: "ok" }],
          [4, 70, "", 70],
          [5, null, "seq 4", { v: 70, k: "ok" }],
          [6, 900, "", 900],
        ])}
        ${pre("UPDATE OmitTbl\n   SET val = (自分より前で、valがNULLでない行のうち\n              seqが最大の行のval)\n WHERE val IS NULL;")}
        <ul class="points">
          <li>「値を取りに行く行」は、<b>同じkeycol</b>、<b>自分より小さいseq</b>、<b>valがNULLでない</b>の3条件で絞った中で、seqが最大の行です。本書はこれを相関サブクエリで書きます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">逆に、NULLに戻す（keycol = A）</div>
        ${vt(["seq", "val", "1つ前の行のval", "同じか", "更新後のval"], [
          [1, 50, null, "比べられない", 50],
          [2, 50, 50, "同じ", { v: null, k: "ng" }],
          [3, 50, 50, "同じ", { v: null, k: "ng" }],
          [4, 70, 50, "違う", 70],
          [5, 70, 70, "同じ", { v: null, k: "ng" }],
          [6, 900, 70, "違う", 900],
        ])}
        ${pre("SET val = CASE WHEN val = (1つ前の行のvalを返すサブクエリ)\n               THEN NULL\n               ELSE val END")}
        <ul class="points">
          <li>1つ前と同じ値ならNULLに戻します。「1つ前の行のval」は相関サブクエリでも、LAG(val, 1)でも求められます。</li>
        </ul>
        <p class="hint">本書は、NULLを飛ばすウィンドウ関数のオプションIGNORE NULLSを使う解も示します（主要なDBMSではOracleとSQL Serverのみ）。また本書によると、MySQLはUPDATE文のサブクエリで、更新先と同じテーブルを読めません。</p>
      </div>
    </div>`,
  rowcol: () => `<p class="takeaway" style="margin:0 0 14px"><b>行→列は、MAX(CASE …)で教科ごとの行を1行にまとめ、行式SET (列, 列, 列) = (…)で3列を1回のサブクエリで更新する。</b>列がNOT NULLなら、NULLが入る2つの原因を別々に防ぎます。</p>
    <div class="grid">
      <div class="col">
        <div class="label">行から列へ：A001の3行が1行になるまで</div>
        ${vt(["subject", "score", "英語のCASE", "国語のCASE", "数学のCASE"], [
          ["英語", 100, { v: 100, k: "acc" }, null, null],
          ["国語", 58, null, { v: 58, k: "acc" }, null],
          ["数学", 90, null, null, { v: 90, k: "acc" }],
          [{ v: "MAXで1行に", k: "ok" }, "", { v: 100, k: "ok" }, { v: 58, k: "ok" }, { v: 90, k: "ok" }],
        ])}
        ${pre("UPDATE ScoreCols\n   SET (score_en, score_nl, score_mt)\n     = (SELECT MAX(CASE WHEN subject = '英語' THEN score END),\n               MAX(CASE WHEN subject = '国語' THEN score END),\n               MAX(CASE WHEN subject = '数学' THEN score END)\n          FROM ScoreRows SR\n         WHERE SR.student_id = ScoreCols.student_id);")}
        <ul class="points">
          <li>CASE式で点数を教科の列に振り分け、NULLを無視するMAXで1行にします。</li>
          <li>1列ずつSETを書くと、サブクエリが教科の数だけ必要です。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">更新後のScoreCols：NULLが残る2つの理由</div>
        ${vt(["student_id", "score_en", "score_nl", "score_mt"], [
          ["A001", 100, 58, 90],
          ["B002", 77, 60, { v: null, k: "acc", n: "← 教科がない" }],
          ["C003", 52, 49, { v: null, k: "acc", n: "← 教科がない" }],
          [{ v: "D004", k: "ng" }, { v: null, k: "ng" }, { v: null, k: "ng" }, { v: null, k: "ng", n: "← 生徒がいない" }],
        ])}
        <ul class="points">
          <li>列がNOT NULLのときは、この2種類のNULLを別々に防ぎます。<b>生徒がいない行はWHERE EXISTSで更新対象から外し、欠けた教科はCOALESCEで0にします。</b></li>
          <li>MERGE文を使うと、2つの表を突き合わせる条件をON句の1か所にまとめられます。</li>
        </ul>
        <div class="label">逆向き（列から行へ）</div>
        ${vt(["ScoreRowsのsubject", "取ってくるScoreColsの列"], [
          ["英語", "score_en"], ["国語", "score_nl"], ["数学", "score_mt"], ["社会", { v: "（対応する列なし）→ NULL", k: "acc" }],
        ])}
      </div>
    </div>`,
  trend: () => `<p class="takeaway" style="margin:0 0 14px"><b>同じテーブルの「1行前」と比べた結果は、相関サブクエリかウィンドウ関数で求める。</b>結果の置き場所は、別テーブルへのINSERT、元テーブルのUPDATE、ビューの3通りで、速さと容量のトレードオフがあります。</p>
    <div class="grid">
      <div class="col">
        <div class="label">trendの計算（A鉄鋼とB商社）</div>
        ${vt(["brand", "sale_date", "price", "1行前のprice", "差", "trend"], [
          ["A鉄鋼", "2008-07-01", 1000, null, null, { v: null, k: "acc" }],
          ["A鉄鋼", "2008-07-04", 1200, 1000, 200, { v: "↑", k: "ok" }],
          ["A鉄鋼", "2008-08-12", 800, 1200, -400, { v: "↓", k: "ok" }],
          ["B商社", "2008-06-04", 3000, { v: null, k: "acc", n: "← 銘柄の最初の行" }, null, { v: null, k: "acc" }],
          ["B商社", "2008-09-11", 3000, 3000, 0, { v: "→", k: "ok" }],
        ])}
        <ul class="points">
          <li>「差」の符号をSIGN関数で1、0、−1にし、CASE式で↑、→、↓に変えます。</li>
          <li>銘柄の最初の行は比べる相手がないので、trendはNULLです。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">「1行前のprice」の求め方</div>
        ${pre("-- 相関サブクエリ：行ごとに、直前の取引日を探して読む\n(SELECT price FROM Stocks S1\n  WHERE brand = Stocks.brand\n    AND sale_date = (SELECT MAX(sale_date) FROM Stocks S2\n                      WHERE brand = Stocks.brand\n                        AND sale_date < Stocks.sale_date))\n\n-- ウィンドウ関数：銘柄ごとに並べて、1行前を見る\nMAX(price) OVER (PARTITION BY brand ORDER BY sale_date\n                 ROWS BETWEEN 1 PRECEDING AND 1 PRECEDING)")}
        <div class="label">結果をどこに持たせるか</div>
        ${vt(["方法", "利点", "欠点"], [
          ["別テーブルにINSERT", "速い。MySQLでも書ける", { v: "容量がほぼ2倍", k: "ng" }],
          ["元のテーブルをUPDATE", "テーブルは1つ", { v: "MySQLは自己参照できない", k: "ng" }],
          ["ビューにする", "容量ゼロ、常に最新", { v: "毎回計算するので最も遅い", k: "ng" }],
        ])}
      </div>
    </div>`,
  model: () => `<p class="takeaway" style="margin:0 0 14px"><b>SQLを書く前に、テーブルに列を足せば簡単に解けないか考える。</b>ただし代わりに、更新コスト・タイムラグ・変更コストの3つが増えます。本書はSQLで解くことに固執する状態をスーパーソルジャー病と呼びます。</p>
    <div class="grid">
      <div class="col">
        <div class="label">問題：配送予定日が受付日から3日以上あとの注文は？</div>
        ${pre("-- SQLで解く：毎回、結合して日数を計算する\nSELECT O.order_id\n  FROM Orders O\n       INNER JOIN OrderReceipts ORC\n          ON O.order_id = ORC.order_id\n WHERE ORC.delivery_date - O.order_date >= 3\n GROUP BY O.order_id;\n\n-- テーブルを変えて解く：フラグを見るだけ\nSELECT order_id\n  FROM Orders\n WHERE del_late_flg = 1;")}
        ${vt(["order_id", "order_date", "明細の配送予定日", "del_late_flg（追加）"], [
          [10000, "2011-08-22", "8/24、8/25、8/26", { v: 1, k: "acc" }],
          [10001, "2011-09-01", "9/4", { v: 1, k: "acc" }],
          [10002, "2011-09-20", "9/22、9/22", 0],
          [10003, "2011-08-05", "8/6、8/10、8/10", { v: 1, k: "acc" }],
          [10004, "2011-08-22", "8/23", 0],
          [10005, "2011-08-29", "8/30、8/30", 0],
        ])}
      </div>
      <div class="col">
        <div class="label">テーブルを変える代わりに増えるもの</div>
        ${vt(["増えるもの", "中身"], [
          [{ v: "更新コスト", k: "ng" }, "フラグを書き込む処理が要る。登録時に決まらなければ、あとでUPDATEする"],
          [{ v: "タイムラグ", k: "ng" }, "明細の配送予定日を直してから、フラグを直すまで食い違う"],
          [{ v: "変更コスト", k: "ng" }, "あとからテーブルを変えると手戻りが大きい。運用開始後はほぼ無理"],
        ])}
        <div class="label">タイムラグが生まれる順番</div>
        ${vt(["順番", "Orders", "OrderReceipts"], [
          ["❶", "注文を登録（フラグ = NULL）", ""],
          ["❷", "", "明細を登録（配送予定日 = NULL）"],
          ["❸", "", { v: "配送予定日 = 8/26に更新", k: "acc" }],
          ["❹", { v: "フラグ = 1に更新", k: "acc" }, ""],
        ])}
        <p class="hint">❸から❹までの間、2つのテーブルの内容が食い違います。夜間バッチなら長くなり、同じトランザクションにすると性能に響きます。</p>
        <p class="hint">テーブル設計は最初が肝心です。商品数を数える類題（9.7）も同じ構図で、商品数は登録時にわかるのでINSERTに含められます。</p>
      </div>
    </div>`,
};

const CH = {
  no: 9,
  store: "sql-jissen-ch9-drill-v1",
  h1: "更新とデータモデル<br>盲目のスーパーソルジャー",
  lede: () => `相関サブクエリ、行式、ウィンドウ関数、MERGE文による更新と、SQLに頼らずデータモデルで解く考え方を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのSQLの実行計画と結果が表示されます。更新のSQLがテーブルを何回読んでいるか、本書とPostgreSQL・MySQLの実際の動きがどこで違うかに注目してください。`,
  points: [
    "SQLにおける更新の効率化は、行式、サブクエリ、CASE式、MERGE文を駆使した総力戦になる。",
    "すべての問題を、必ずしもコーディングで解く必要はない。",
    "モデル変更のほうがスムーズに解ける問題も多いが、あとからモデルを変えるのは大変。",
    "スーパーソルジャーとスーパーエンジニアの視点は、一兵卒と将官ぐらい違う。",
  ],
};
