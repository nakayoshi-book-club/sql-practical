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
  { type: "intro", id: "plan", title: "この章の全体像" },
  { type: "intro", id: "fill", title: "NULLの埋め立てと逆演算" },
  { type: "intro", id: "rowcol", title: "行から列へ①　3教科をまとめて更新" },
  { type: "intro", id: "nn", title: "行から列へ②　NOT NULLの列への更新" },
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
    type: "q", sec: "9.1 更新は効率的に", title: "ぐるぐる系と1つのSQL文", ref: "plan", table: ["omit"], tableNote: OMIT_NOTE,
    prompt: "OmitTblのNULLを埋める処理を、2通りで書いた。アプリからデータベースに送るSQL文の数は、それぞれ何回？",
    code: "-- ぐるぐる系：アプリでループを回し、1行ずつUPDATEする\nrows = SELECT keycol, seq, val FROM OmitTbl ORDER BY keycol, seq;\nfor row in rows:\n    if row.val is NULL:\n        UPDATE OmitTbl SET val = :prev\n         WHERE keycol = :row.keycol AND seq = :row.seq;\n    else:\n        prev = row.val\n\n-- 1つのSQL文：本書の解\nUPDATE OmitTbl\n   SET val = (SELECT val\n                FROM OmitTbl OT1\n               WHERE OT1.keycol = OmitTbl.keycol\n                 AND OT1.seq = (SELECT MAX(seq)\n                                  FROM OmitTbl OT2\n                                 WHERE OT2.keycol = OmitTbl.keycol\n                                   AND OT2.seq < OmitTbl.seq\n                                   AND OT2.val IS NOT NULL))\n WHERE val IS NULL;",
    choices: [
      { text: "ぐるぐる系は7回（SELECTが1回、UPDATEが6回）、本書の解は1回", ok: true, note: "ぐるぐる系は、全行を読むSELECTを1回送り、NULLの6行それぞれでUPDATEを1回ずつ送ります。本書の解は、UPDATE文を1回送るだけです。" },
      { text: "ぐるぐる系は13回（SELECTが1回、全12行にUPDATE）、本書の解は1回", ok: false, note: "ifで分岐しているので、UPDATEを送るのはvalがNULLの6行だけです。" },
      { text: "ぐるぐる系は7回、本書の解も7回（NULLの行ごとにサブクエリを送る）", ok: false, note: "本書の解のサブクエリは、データベースの中で動きます。アプリから送るのは、UPDATE文の1回だけです。" },
      { text: "どちらも1回。ぐるぐる系も、データベースがまとめて実行する", ok: false, note: "ループはアプリの側にあるので、データベースは1行分のUPDATEを1つずつ受け取ります。全体で何をしたいのかは、データベースからは見えません。" },
    ],
    show: [{ q: "fill_corr", tag: "本書の解" }],
    takeaway: "<b>ぐるぐる系は「この1行を直せ」を行の数だけ送り、1つのSQL文は「こういう結果にしろ」を1回送る。</b>ループを回すのがアプリかデータベースかの違いです。本書の解でも、データベースの中では相関サブクエリが行ごとに動いており、その回数は実行計画のloopsで確かめられます。",
  },
  {
    type: "q", sec: "9.1 更新は効率的に", title: "相関サブクエリは何回動いたか", ref: "plan", table: ["omit"], tableNote: OMIT_NOTE,
    prompt: "本書の相関サブクエリの解を、PostgreSQLで実行した。実行計画のSubPlan 2（OT1を読むサブクエリ）は何回実行された？",
    code: "UPDATE OmitTbl\n   SET val = (SELECT val\n                FROM OmitTbl OT1\n               WHERE OT1.keycol = OmitTbl.keycol\n                 AND OT1.seq = (SELECT MAX(seq)\n                                  FROM OmitTbl OT2\n                                 WHERE OT2.keycol = OmitTbl.keycol\n                                   AND OT2.seq < OmitTbl.seq\n                                   AND OT2.val IS NOT NULL))\n WHERE val IS NULL;",
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
    type: "q", sec: "9.1 更新は効率的に", title: "逆にNULLを作る", ref: "fill", table: ["omit_filled"], tableNote: FILLED_NOTE,
    prompt: "埋め立て後の表から、省略された元の表に戻すUPDATE文は、CASE式の比較の中にサブクエリを丸ごと書いている。こう書けるのはなぜ？",
    code: "UPDATE OmitFilled\n   SET val = CASE WHEN val\n                    = (SELECT val\n                         FROM OmitFilled O1\n                        WHERE O1.keycol = OmitFilled.keycol\n                          AND O1.seq\n                                = (SELECT MAX(seq)\n                                     FROM OmitFilled O2\n                                    WHERE O2.keycol = OmitFilled.keycol\n                                      AND O2.seq < OmitFilled.seq))\n                  THEN NULL\n                  ELSE val END;",
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
    code: "WITH VIEW_LAG (keycol, seq, pre_val)\n  AS (SELECT keycol, seq,\n             LAG(val, 1) OVER (PARTITION BY keycol\n                                   ORDER BY seq)\n        FROM OmitFilled)\nUPDATE OmitFilled\n   SET val = CASE WHEN (SELECT pre_val\n                          FROM VIEW_LAG\n                         WHERE VIEW_LAG.keycol = OmitFilled.keycol\n                           AND VIEW_LAG.seq = OmitFilled.seq) = val\n                  THEN NULL\n                  ELSE val END;",
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
      { q: "rev_corr", tag: "相関サブクエリ", ok: false, note: "ERROR 1093（更新先のテーブルをFROM句で指定できない）で止まります。MySQLは、UPDATE文のサブクエリの中で、更新先と同じテーブル（ここではOmitFilled）を読むことを許していません。" },
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
    type: "q", sec: "9.2 行から列への更新", title: "NOT NULLの列への更新", ref: "nn", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "行式の解（COALESCEなし）を、NOT NULL制約の付いたScoreColsNNに対して実行した。PostgreSQLは、どの行の値で止まった？",
    code: "UPDATE ScoreColsNN\n   SET (score_en, score_nl, score_mt)\n         = (SELECT MAX(CASE WHEN subject = '英語'\n                            THEN score\n                            ELSE NULL END) AS score_en,\n                   MAX(CASE WHEN subject = '国語'\n                            THEN score\n                            ELSE NULL END) AS score_nl,\n                   MAX(CASE WHEN subject = '数学'\n                            THEN score\n                            ELSE NULL END) AS score_mt\n              FROM ScoreRows SR\n             WHERE SR.student_id = ScoreColsNN.student_id);",
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
    type: "q", sec: "9.2 行から列への更新", title: "EXISTSを外すと", ref: "nn", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "NOT NULLに対応した行式の解から、外側のWHERE EXISTS（ScoreRowsに生徒がいる行に限る）を外した。PostgreSQLではどうなった？",
    code: "UPDATE ScoreColsNN\n   SET (score_en, score_nl, score_mt)\n         = (SELECT COALESCE(MAX(CASE WHEN subject = '英語'\n                                     THEN score\n                                     ELSE NULL END), 0) AS score_en,\n                   COALESCE(MAX(CASE WHEN subject = '国語'\n                                     THEN score\n                                     ELSE NULL END), 0) AS score_nl,\n                   COALESCE(MAX(CASE WHEN subject = '数学'\n                                     THEN score\n                                     ELSE NULL END), 0) AS score_mt\n              FROM ScoreRows SR\n             WHERE SR.student_id = ScoreColsNN.student_id);",
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
    type: "q", sec: "9.2 行から列への更新", title: "MERGE文を使う利点", ref: "nn", table: ["score_rows", "score_cols_nn"], tableNote: NN_NOTE,
    prompt: "UPDATE文の代わりにMERGE文を使う利点として、本書が挙げるものはどれ？",
    code: "-- UPDATE文（行式）\nUPDATE ScoreColsNN\n   SET (score_en, score_nl, score_mt)\n         = (SELECT COALESCE(MAX(CASE WHEN subject = '英語'\n                                     THEN score\n                                     ELSE NULL END), 0) AS score_en,\n                   COALESCE(MAX(CASE WHEN subject = '国語'\n                                     THEN score\n                                     ELSE NULL END), 0) AS score_nl,\n                   COALESCE(MAX(CASE WHEN subject = '数学'\n                                     THEN score\n                                     ELSE NULL END), 0) AS score_mt\n              FROM ScoreRows SR\n             WHERE SR.student_id = ScoreColsNN.student_id)\n WHERE EXISTS (SELECT *\n                 FROM ScoreRows\n                WHERE student_id = ScoreColsNN.student_id);\n\n-- MERGE文\nMERGE INTO ScoreColsNN\n   USING (SELECT student_id,\n                 COALESCE(MAX(CASE WHEN subject = '英語'\n                                   THEN score\n                                   ELSE NULL END), 0) AS score_en,\n                 COALESCE(MAX(CASE WHEN subject = '国語'\n                                   THEN score\n                                   ELSE NULL END), 0) AS score_nl,\n                 COALESCE(MAX(CASE WHEN subject = '数学'\n                                   THEN score\n                                   ELSE NULL END), 0) AS score_mt\n            FROM ScoreRows\n           GROUP BY student_id) SR\n      ON (ScoreColsNN.student_id = SR.student_id)\n   WHEN MATCHED THEN\n        UPDATE SET score_en = SR.score_en,\n                   score_nl = SR.score_nl,\n                   score_mt = SR.score_mt;",
    choices: [
      { text: "UPDATE文では、SET句のサブクエリとWHERE句のEXISTSの2か所に散らばる結合条件を、ON句の1か所にまとめられる", ok: true, note: "2か所にあると、片方だけを直して、もう一方を直し忘れるミスを招きやすくなります。性能面でも、ScoreRowsを1回読んで集約し、1回結合するだけで済みます（PostgreSQLの計画もHashAggregateとHash Joinが1つずつです）。" },
      { text: "MERGE文は、全行をロックせずに更新できる", ok: false, note: "本書が挙げている利点ではありません。" },
      { text: "MERGE文は標準SQLではないが、どのDBMSでも同じ構文で書ける", ok: false, note: "MERGE文はSQL:2003で標準に入りました。ただし構文には実装ごとの違いがあり、たとえばPostgreSQLでは、SET句の列名に表名を付けるとエラーになります。MySQL 8.0はMERGE文に対応していません。" },
      { text: "MERGE文なら、更新先にいない生徒（D004）も自動的に追加される", ok: false, note: "追加するにはWHEN NOT MATCHED THEN INSERTを書く必要があります。本書の解はWHEN MATCHEDだけです。" },
    ],
    show: [{ q: "merge_fix", tag: "MERGE文" }, { q: "nn_row", tag: "UPDATE文（行式）" }, { q: "nn_each", tag: "UPDATE文（1列ずつ）" }],
    takeaway: "MERGE文は、もともとUPDATEとINSERTを一度に行うための構文です。<b>UPDATEだけを書いてもよい、という点を利用したトリック</b>です。",
  },
  {
    type: "q", sec: "9.4 同じテーブルの異なる行からの更新", title: "株価のトレンドを計算する", ref: "trend", table: ["stocks"], tableNote: STOCKS_NOTE,
    prompt: "銘柄ごとに直前の取引日の終値と比べ、trend（↑、↓、→）を計算してStocks2にINSERTしたい。正しいtrendを入れ、かつStocksを1回しか読まないのはどれ？",
    choices: [
      { q: "trend_corr", tag: "相関サブクエリ", ok: false, note: "結果は正しいものの、PostgreSQLの計画ではStocksを3系統で読んでいます。SubPlan 2とInitPlan 1（MAX(sale_date)）がloops=10です。" },
      { q: "trend_nopart", tag: "PARTITION BYなし", ok: false, note: "銘柄の区切りがないので、B商社の最初の行が、A鉄鋼の最後の800と比べられて↑になります。C電気（↑）とD産業（↓）の最初の行も、前の銘柄の終値と比べられています（結果タブ）。" },
      { q: "trend_window", tag: "PARTITION BY brand", ok: true, note: "ROWS BETWEEN 1 PRECEDING AND 1 PRECEDINGで、銘柄ごとに1行前の終値を取ります。Seq Scan on stocksは1つで、brandとsale_dateでSortしてからWindowAggで計算します。" },
    ],
    takeaway: "<b>行間比較の相関サブクエリは、ウィンドウ関数で1回のスキャンに置き換えられる。</b>MySQL 8.0では、本書の図9.28と違って、相関サブクエリの解でもINSERT SELECTの計画を表示できました（実行計画タブのMySQL）。",
  },
  {
    type: "q", sec: "9.4 同じテーブルの異なる行からの更新", title: "銘柄の最初の行のtrend", ref: "trend", table: ["stocks"], tableNote: STOCKS_NOTE,
    prompt: "ウィンドウ関数の解でStocks2にINSERTした。B商社の最初の取引日（2008-06-04、3000円）の行には、trendとして何が入った？",
    code: "INSERT INTO Stocks2\nSELECT brand, sale_date, price,\n       CASE SIGN(price -\n                  MAX(price) OVER (PARTITION BY brand\n                                       ORDER BY sale_date\n                                   ROWS BETWEEN 1 PRECEDING\n                                            AND 1 PRECEDING))\n            WHEN -1 THEN '↓'\n            WHEN 0 THEN '→'\n            WHEN 1 THEN '↑'\n            ELSE NULL\n        END\n  FROM Stocks S2;",
    choices: [
      { text: "'→'", ok: false, note: "B商社の中で取引日順に並べると、この行が最初です。比べる1つ前の行がありません。" },
      { text: "'↑'", ok: false, note: "PARTITION BY brandがなければ、前の銘柄（A鉄鋼の最後の800円）と比べられて↑になります。この解は銘柄ごとに分けているので、そうなりません。" },
      { text: "NULL", ok: true, note: "1つ前の行がないので、MAX(price) OVER (…)はNULLを返します。price − NULLもSIGN(NULL)もNULLなので、CASE式はどのWHENにも当たらず、ELSE NULLになります（結果タブ）。" },
      { text: "エラーで止まる", ok: false, note: "NULLを含む計算はNULLになるだけで、エラーにはなりません。trend列はNULLを許しています。" },
    ],
    show: [{ q: "trend_window", tag: "ウィンドウ関数" }],
    takeaway: "<b>NULLを含む計算はNULLになり、CASE式ではELSEに進む。</b>各銘柄の最初の行は比べる相手がないので、trendはNULLです。A鉄鋼、C電気、D産業の最初の行も同じです。",
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
    type: "q", sec: "9.6 モデル変更の注意点", title: "モデル変更のトレードオフ", ref: "model", table: ["orders", "order_receipts"], tableNote: ORDERS_NOTE,
    prompt: "配送遅延フラグを追加するモデル変更にも、トレードオフがある。本書が挙げていないのはどれ？",
    choices: [
      { text: "検索の負荷を更新に押し付けるので、更新コストが高まる", ok: false, note: "本書が挙げています。登録時にフラグが決まらなければ、あとでUPDATEが要ります。" },
      { text: "明細の配送予定日とフラグの間に、同期が取れていない時間帯（タイムラグ）が生まれる", ok: false, note: "本書が挙げています。夜間バッチで一括更新すると長くなり、完全なリアルタイム性を求めると同じトランザクションで処理する必要があって、性能に響きます。" },
      { text: "あとからのモデル変更は手戻りが大きく、ほかの処理にも副作用が出るおそれがある", ok: false, note: "本書が挙げています。商用運用に入ってからの変更は、もう現実的ではありません。" },
      { text: "フラグの列を足すと、Ordersの主キーを変更しなければならない", ok: true, note: "本書が挙げていません。フラグは普通の列として追加するだけで、主キーは変わりません。" },
    ],
    show: [{ q: "late_join", tag: "SQLで解く（結合）" }],
    takeaway: "本書の3つのトレードオフは、<b>更新コスト、更新までのタイムラグ、モデル変更のコスト</b>です。モデリングは、事前にあらゆる要因を想定しておかないと、あとで問題を引き起こすホットスポットです。",
  },
  {
    type: "q", sec: "9.6 モデル変更の注意点", title: "フラグを更新する前に検索すると", ref: "model",
    prompt: "Ordersに配送遅延フラグ（del_late_flg）の列を足した。注文10000は、配送予定日が受付日の4日後なので、本来は遅延あり（1）だ。❸のあと❹の前に、遅延している注文を探すSQLを実行すると、10000は結果に含まれる？",
    code: "-- 注文10000の処理の順番（図9.34）\n❶ Orders        ：注文を登録（受付日 = 2011-08-22、del_late_flg = NULL）\n❷ OrderReceipts ：明細を登録（配送予定日 = NULL）\n❸ OrderReceipts ：配送予定日を 2011-08-26 に更新\n                   ← ここで下のSQLを実行する\n❹ Orders        ：del_late_flg を 1 に更新\n\n-- 遅延している注文を探すSQL\nSELECT order_id\n  FROM Orders\n WHERE del_late_flg = 1;",
    choices: [
      { text: "含まれる。配送予定日はもう8/26になっているから", ok: false, note: "このSQLが見ているのは、Ordersのdel_late_flgだけです。OrderReceiptsの配送予定日は見ていません。" },
      { text: "含まれない。フラグはまだNULLなので、本当は遅延しているのに見つからない", ok: true, note: "❹でフラグを1に更新するまでは、del_late_flg = 1が真になりません。OrderReceiptsとOrdersの内容が食い違っている時間帯です。" },
      { text: "エラーになる。フラグがNULLの行があるから", ok: false, note: "NULL = 1は真にも偽にもならず（不明）、その行が結果から外れるだけです。エラーにはなりません。" },
      { text: "含まれる。データベースがフラグを自動的に計算し直すから", ok: false, note: "del_late_flgは普通の列です。誰かがUPDATEしない限り、値は変わりません。" },
    ],
    takeaway: "<b>これがタイムラグ。検索を速くした代わりに、フラグと元のデータが食い違う時間ができる。</b>本書によると、夜間バッチでまとめて更新するとこの時間が長くなり、完全なリアルタイムを求めて❸と❹を同じトランザクションで処理すると、性能に厳しいトレードオフが生じます。",
  },
  {
    type: "q", sec: "9.7 スーパーソルジャー病：類題", title: "商品数の列と遅延フラグの違い", ref: "model", table: ["orders", "order_receipts"], tableNote: ORDERS_NOTE,
    prompt: "Ordersに商品数（item_count）の列を足すモデル変更は、配送遅延フラグを足す場合より更新コストの面で有利だ。本書が挙げる理由はどれ？",
    choices: [
      { text: "商品数は普通、注文を登録する時点でわかるので、INSERT文の中に吸収できる", ok: true, note: "遅延フラグは、配送予定日があとで決まると、あとからUPDATEする必要があります。商品数は登録時に入れられるので、更新コストはほとんど上がりません。" },
      { text: "商品数は数値なので、フラグより小さい容量で済む", ok: false, note: "容量の問題ではありません。いつ値が決まるかの問題です。" },
      { text: "商品数はあとから変わることがないので、同期の問題が一切起きない", ok: false, note: "本書は、登録した注文をあとから変更する場合には商品数も直す必要があり、同じ同期の問題を考える必要があると注意しています。" },
      { text: "商品数ならインデックスが要らないから", ok: false, note: "本書が挙げる理由ではありません。" },
    ],
    show: [{ q: "cnt_agg", tag: "SQLで解く（集約関数）" }],
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

// 基礎スライドのタイトルの上に、スライド1のどちらの主張に属するかを出す
const CLAIM_OF = { fill: 1, rowcol: 1, nn: 1, trend: 1, model: 2 };
const INTRO_KICKER = s => {
  const no = CLAIM_OF[s.id];
  if (!no) return "";
  const t = no === 1 ? { k: "acc", s: "更新は、1つのSQL文で書ける" } : { k: "ok", s: "SQLで解く前に、テーブルの形を疑え" };
  return `<div style="display:inline-block;background:${TONE[t.k]};border-radius:999px;padding:4px 14px;margin:4px 0 6px;font-size:14px;font-weight:700">主張${no}「${t.s}」の具体例</div>`;
};

// 各スライドの前提：何がある状況で、何をしたいのか
const premise = (rows, side = "") => `<div style="border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:0 0 14px;background:var(--surface);display:flex;flex-wrap:wrap;gap:12px 24px;align-items:flex-start">
    <div style="flex:1 1 320px;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:15px;line-height:1.6">
      ${rows.map(([h, b]) => `<div style="font-weight:700;color:var(--muted);white-space:nowrap">${h}</div><div>${b}</div>`).join("")}
    </div>
    ${side ? `<div style="flex:0 1 auto;display:flex;flex-wrap:wrap;gap:12px;font-size:13px">${side}</div>` : ""}
  </div>`;
// 前提の枠に置く元データの表（setup.sqlと同じ値）
const tb = (name, cols, rows) => `<div><div class="label" style="margin:0 0 4px">${name}</div>${vt(cols, rows)}</div>`;
const N = null;
const SIDE = {
  fill: tb("OmitTbl（keycol = A）", ["seq", "val"], [[1, 50], [2, N], [3, N], [4, 70], [5, N], [6, 900]])
      + tb("OmitTbl（keycol = B）", ["seq", "val"], [[1, 10], [2, 20], [3, N], [4, 3], [5, N], [6, N]]),
  rowcol: tb("ScoreRows（行持ち）", ["student_id", "subject", "score"], [["A001", "英語", 100], ["A001", "国語", 58], ["A001", "数学", 90], ["B002", "英語", 77], ["B002", "国語", 60], ["C003", "英語", 52], ["C003", "国語", 49], ["C003", "社会", 100]])
      + tb("ScoreCols（列持ち・更新前）", ["student_id", "score_en", "score_nl", "score_mt"], [["A001", N, N, N], ["B002", N, N, N], ["C003", N, N, N], ["D004", N, N, N]]),
  nn: tb("①の更新後のScoreCols（NULLを入れてよい表）", ["student_id", "score_en", "score_nl", "score_mt"], [["A001", 100, 58, 90], ["B002", 77, 60, { v: N, k: "acc", n: "← 教科がない" }], ["C003", 52, 49, { v: N, k: "acc", n: "← 教科がない" }], [{ v: "D004", k: "ng" }, { v: N, k: "ng" }, { v: N, k: "ng" }, { v: N, k: "ng", n: "← 生徒がいない" }]])
      + tb("ScoreColsNN（3列ともNOT NULL・更新前）", ["student_id", "score_en", "score_nl", "score_mt"], [["A001", 0, 0, 0], ["B002", 0, 0, 0], ["C003", 0, 0, 0], ["D004", 0, 0, 0]]),
  trend: tb("Stocks", ["brand", "sale_date", "price"], [["A鉄鋼", "2008-07-01", 1000], ["A鉄鋼", "2008-07-04", 1200], ["A鉄鋼", "2008-08-12", 800], ["B商社", "2008-06-04", 3000], ["B商社", "2008-09-11", 3000], ["C電気", "2008-07-01", 9000], ["D産業", "2008-06-04", 5000], ["D産業", "2008-06-05", 5000], ["D産業", "2008-06-06", 4800], ["D産業", "2008-12-01", 5100]]),
  model: tb("Orders（注文）", ["order_id", "order_shop", "order_name", "order_date"], [[10000, "東京", "後藤信二", "2011-08-22"], [10001, "埼玉", "佐原商店", "2011-09-01"], [10002, "千葉", "水原陽子", "2011-09-20"], [10003, "山形", "加地健太郎", "2011-08-05"], [10004, "青森", "相原酒店", "2011-08-22"], [10005, "長野", "宮元雄介", "2011-08-29"]])
      + tb("OrderReceipts（注文明細）", ["order_id", "order_receipt_id", "item_group", "delivery_date"], [[10000, 1, "食器", "2011-08-24"], [10000, 2, "菓子詰め合わせ", "2011-08-25"], [10000, 3, "牛肉", "2011-08-26"], [10001, 1, "魚介類", "2011-09-04"], [10002, 1, "菓子詰め合わせ", "2011-09-22"], [10002, 2, "調味料セット", "2011-09-22"], [10003, 1, "米", "2011-08-06"], [10003, 2, "牛肉", "2011-08-10"], [10003, 3, "食器", "2011-08-10"], [10004, 1, "野菜", "2011-08-23"], [10005, 1, "飲料水", "2011-08-30"], [10005, 2, "菓子詰め合わせ", "2011-08-30"]]),
};

// 基礎スライドのコードは、横スクロールさせずに折り返して全文を見せる
const code = s => `<pre style="white-space:pre-wrap;overflow-wrap:anywhere;overflow-x:visible">${esc(s)}</pre>`;

const INTRO_BODY = {
  plan: () => {
    const card = (no, tone, head, sub, secs) => `<div class="col" style="background:${TONE[tone]};border-radius:12px;padding:22px 24px">
        <div style="font-size:15px;font-weight:700;color:var(--muted);letter-spacing:.08em">主張${no}</div>
        <div style="font-size:30px;font-weight:800;line-height:1.35;margin:8px 0 12px">${head}</div>
        <div style="font-size:17px;line-height:1.6">${sub}</div>
        <div style="font-size:14px;color:var(--muted);margin-top:14px">${secs}</div>
      </div>`;
    return `${premise([["前提", "SQLは検索のために生まれた言語で、更新の機能はあまり知られていない。そのため、1行だけ更新するSQL文をループで回す「ぐるぐる系」（第5章）の非効率なコードが多い。"]])}
    <div class="grid">
      ${card(1, "acc", "更新は、1つのSQL文で書ける", "1行ずつ回すループは要らない。相関サブクエリ、行式、CASE式、ウィンドウ関数、MERGE文を組み合わせる。", "9.1〜9.4 ／ スライド2〜5")}
      ${card(2, "ok", "SQLで解く前に、テーブルの形を疑え", "列を1つ足せば、難しいSQLが要らなくなることがある。ただし設計はあとから変えにくいので、最初が肝心。", "9.5〜9.8 ／ スライド6")}
    </div>`;
  },
  fill: () => `${premise([["あるもの", "OmitTbl。valが前の行（同じkeycolで1つ前のseq）と同じときは、入力の手間を省くためにNULLにしてある。紙のデータを手で入力するときによくある省略です。"], ["困ること", "ルールを知っている人間には読めるが、このままではvalを集計できない。"], ["したいこと", "NULLを本来の値で埋める（埋め立て）。逆に、埋めた表を省略した形に戻す（逆演算）。"], ["論点", "1行ずつ回すループではなく、1つのUPDATE文で書けるか。"]], SIDE.fill)}
    <p class="takeaway" style="margin:0 0 14px"><b>同じkeycolの「前の行」を相関サブクエリで見れば、NULLを埋めるのも戻すのも1つのUPDATE文で書ける。</b>埋めるときの肝は「valがNULLでない行に限る」条件で、これがあるからNULLが続いても値のある行まで遡れます。</p>
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
        ${code("UPDATE OmitTbl\n   SET val = (自分より前で、valがNULLでない行のうち\n              seqが最大の行のval)\n WHERE val IS NULL;")}
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
        ${code("SET val = CASE WHEN val = (1つ前の行のvalを返すサブクエリ)\n               THEN NULL\n               ELSE val END")}
        <ul class="points">
          <li>1つ前と同じ値ならNULLに戻します。「1つ前の行のval」は相関サブクエリでも、LAG(val, 1)でも求められます。</li>
        </ul>
      </div>
    </div>`,
  rowcol: () => `${premise([["あるもの", "テストの点数。1教科で1行の表ScoreRows（行持ち）にある。"], ["したいこと", "1生徒で1行、教科を列に並べた表ScoreCols（列持ち）へ、形を変えながらコピーする。"], ["論点", "3つの列を更新するのに、ScoreRowsを何回読むか。"]], SIDE.rowcol)}
    <p class="takeaway" style="margin:0 0 14px"><b>1列ずつSETを書くと、ScoreRowsを教科の数だけ読み直す。行式SET (列, 列, 列) = (…)なら、1回のサブクエリで3列まとめて更新できる。</b></p>
    <div class="grid">
      <div class="col">
        <div class="label">良くない例：1列ずつSETを書く（リスト9.8）</div>
        ${code("UPDATE ScoreCols\n   SET score_en = (SELECT score FROM ScoreRows SR\n                    WHERE SR.student_id = ScoreCols.student_id\n                      AND subject = '英語'),\n       score_nl = (SELECT score FROM ScoreRows SR\n                    WHERE SR.student_id = ScoreCols.student_id\n                      AND subject = '国語'),\n       score_mt = (SELECT score FROM ScoreRows SR\n                    WHERE SR.student_id = ScoreCols.student_id\n                      AND subject = '数学');")}
        ${vt(["", "サブクエリ", "ScoreRowsを読む回数"], [
          ["1列ずつ", "3つ（教科ごと）", { v: "3つ × 4人 = 12回", k: "ng" }],
          ["行式", "1つ", { v: "1つ × 4人 = 4回", k: "ok" }],
        ])}
        <p class="hint">サブクエリは更新するScoreColsの行（4人）ごとに1回ずつ動きます。PostgreSQLの実行計画では、1列ずつの版はSubPlan 1〜3がそれぞれloops=4、行式の版はSubPlan 1だけがloops=4です。</p>
      </div>
      <div class="col">
        <div class="label">良い例：行式でまとめて更新する（リスト9.9）</div>
        ${code("UPDATE ScoreCols\n   SET (score_en, score_nl, score_mt)\n     = (SELECT MAX(CASE WHEN subject = '英語' THEN score END),\n               MAX(CASE WHEN subject = '国語' THEN score END),\n               MAX(CASE WHEN subject = '数学' THEN score END)\n          FROM ScoreRows SR\n         WHERE SR.student_id = ScoreCols.student_id);")}
        <div class="label">サブクエリの中身（A001のとき）</div>
        ${vt(["選ばれた行", "英語のCASE", "国語のCASE", "数学のCASE"], [
          ["英語, 100", { v: 100, k: "acc" }, null, null],
          ["国語, 58", null, { v: 58, k: "acc" }, null],
          ["数学, 90", null, null, { v: 90, k: "acc" }],
          [{ v: "MAXで1行に畳む", k: "ok" }, { v: 100, k: "ok" }, { v: 58, k: "ok" }, { v: 90, k: "ok" }],
        ])}
        <p class="hint">WHEREで選ぶのはその生徒の全教科の行（A001なら3行）です。CASE式は行を減らさず、教科が合わない列をNULLにします。SETの右側は1行でなければならないので、NULLを無視するMAXで1行に畳みます。</p>
      </div>
    </div>`,
  nn: () => `${premise([["①の結果", "①の更新先ScoreColsは、列にNULLを入れてよい表だった。そのため、B002とC003の数学（教科がない）と、D004の3列（生徒がいない）はNULLのまま更新された。"], ["ここで仮定", "もし更新先の3列にNOT NULL制約が付いていたら？ 本書はこれを別の表ScoreColsNNで考える。NOT NULLの列は空にしておけないので、更新前の値はすべて0にしてある。"], ["論点", "①の良い例を、更新先だけScoreColsNNに変えて実行するとどうなるか。"]], SIDE.nn)}
    <p class="takeaway" style="margin:0 0 14px"><b>NULLの原因ごとに防ぎ方を変える。欠けた教科はCOALESCEで0にし、ScoreRowsにいない生徒はWHERE EXISTSで更新対象から外す。</b></p>
    <div class="label">1. ①の良い例をそのまま実行すると、エラーになる</div>
    ${code('ERROR:  null value in column "score_mt" of relation "scorecolsnn" violates not-null constraint\nDETAIL:  Failing row contains (B002, 77, 60, null).')}
    <p class="hint">B002の数学にNULLを入れようとして、NOT NULL制約に違反しました。1行でも違反すると、UPDATE文全体が取り消されます。</p>
    <div class="label">2. 2つの原因を別々に防ぐ（リスト9.12）</div>
    ${code("UPDATE ScoreColsNN\n   SET (score_en, score_nl, score_mt)\n     = (SELECT COALESCE(MAX(CASE WHEN subject = '英語' THEN score END), 0),   -- 教科がなければ0\n               COALESCE(MAX(CASE WHEN subject = '国語' THEN score END), 0),\n               COALESCE(MAX(CASE WHEN subject = '数学' THEN score END), 0)\n          FROM ScoreRows SR\n         WHERE SR.student_id = ScoreColsNN.student_id)\n WHERE EXISTS (SELECT *                                   -- ScoreRowsにいる生徒だけ更新する\n                 FROM ScoreRows\n                WHERE student_id = ScoreColsNN.student_id);")}
    ${vt(["NULLの原因", "防ぎ方", "読み方", "更新後"], [
      ["教科がない（B002・C003の数学）", { v: "COALESCE(…, 0)", k: "acc" }, "NULLなら0にする", "数学は0"],
      ["生徒がいない（D004）", { v: "WHERE EXISTS (…)", k: "acc" }, "ScoreRowsに1行でもいる生徒だけ更新する", "更新されず、初期値の0のまま"],
    ])}`,
  trend: () => `${premise([["あるもの", "Stocks。銘柄ごとに、取引日とその日の株価がある。"], ["したいこと", "各行に、前回の取引日より株価が上がった（↑）、同じ（→）、下がった（↓）を表すtrendを付けて、空の表Stocks2にINSERTする。"], ["論点", "同じテーブルの別の行（同じ銘柄の1つ前の取引日）の値を、どう参照するか。"]], SIDE.trend)}
    <p class="takeaway" style="margin:0 0 14px"><b>同じテーブルの「1行前」と比べた結果は、相関サブクエリかウィンドウ関数で求める。</b></p>
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
        ${code("-- 相関サブクエリ：行ごとに、直前の取引日を探して読む\n(SELECT price FROM Stocks S1\n  WHERE brand = Stocks.brand\n    AND sale_date = (SELECT MAX(sale_date) FROM Stocks S2\n                      WHERE brand = Stocks.brand\n                        AND sale_date < Stocks.sale_date))\n\n-- ウィンドウ関数：銘柄ごとに並べて、1行前を見る\nMAX(price) OVER (PARTITION BY brand ORDER BY sale_date\n                 ROWS BETWEEN 1 PRECEDING AND 1 PRECEDING)")}
      </div>
    </div>`,
  model: () => `${premise([["あるもの", "ギフトの受注を管理する2つの表。Ordersは注文1件で1行、OrderReceiptsは注文の中の商品ごとに1行（一対多）。"], ["したいこと", "受付日から配送予定日まで3日以上ある注文を見つけて、注文者に遅れる旨を連絡したい。"], ["論点", "SQLを工夫して解くか、テーブルの形を変えて解くか。"]], SIDE.model)}
    <p class="takeaway" style="margin:0 0 14px"><b>SQLを書く前に、テーブルに列を足せば簡単に解けないか考える。</b>ただし代わりに、更新コスト・タイムラグ・変更コストの3つが増えます。本書はSQLで解くことに固執する状態をスーパーソルジャー病と呼びます。</p>
    <div class="grid">
      <div class="col">
        <div class="label">問題：配送予定日が受付日から3日以上あとの注文は？</div>
        ${code("-- SQLで解く：毎回、結合して日数を計算する\nSELECT O.order_id\n  FROM Orders O\n       INNER JOIN OrderReceipts ORC\n          ON O.order_id = ORC.order_id\n WHERE ORC.delivery_date - O.order_date >= 3\n GROUP BY O.order_id;\n\n-- テーブルを変えて解く：フラグを見るだけ\nSELECT order_id\n  FROM Orders\n WHERE del_late_flg = 1;")}
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
      </div>
    </div>`,
};


const CH = {
  no: 9,
  store: "sql-jissen-ch9-drill-v1",
  introEyebrow: "",
  h1: "更新とデータモデル<br>盲目のスーパーソルジャー",
  lede: () => `相関サブクエリ、行式、ウィンドウ関数、MERGE文による更新と、SQLに頼らずデータモデルで解く考え方を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのSQLの実行計画と結果が表示されます。更新のSQLがテーブルを何回読んでいるか、本書とPostgreSQL・MySQLの実際の動きがどこで違うかに注目してください。`,
  points: [
    "SQLにおける更新の効率化は、行式、サブクエリ、CASE式、MERGE文を駆使した総力戦になる。",
    "すべての問題を、必ずしもコーディングで解く必要はない。",
    "モデル変更のほうがスムーズに解ける問題も多いが、あとからモデルを変えるのは大変。",
    "スーパーソルジャーとスーパーエンジニアの視点は、一兵卒と将官ぐらい違う。",
  ],
};
