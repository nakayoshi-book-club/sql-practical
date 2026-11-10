const T = {
  orders: { name: "Orders（注文）", cols: ["order_id", "shop_id", "shop_name", "receive_date", "process_flg"], rows: [
    ["00000001","0002","店舗0002","2022-01-01","5"],["00000002","0003","店舗0003","2022-01-01","5"],
    ["00000010","0001","東京本店","2022-01-01","5"],["00000109","0100","佐世保北店","2022-01-01","5"],
    ["00000221","0200","佐世保中央店","2022-01-01","5"],["00000332","0300","JR佐世保駅前店","2022-01-01","5"],
    ["00500000","0001","東京本店","2024-01-01","5"],["00830001","0002","店舗0002","2025-04-27","4"],
    ["00880001","0002","店舗0002","2025-07-09","3"],["00930001","0002","店舗0002","2025-09-20","2"],
    ["00980001","0002","店舗0002","2025-12-02","1"],["01000000","0001","東京本店","2025-12-31","1"]] },
  shops: { name: "Shops（店舗）", cols: ["shop_id", "shop_name"], rows: [
    ["0001","東京本店"],["0002","店舗0002"],["0003","店舗0003"],["0100","佐世保北店"],
    ["0200","佐世保中央店"],["0300","JR佐世保駅前店"],["0500","店舗0500"],["0901","店舗0901"]] },
  sometable: { name: "SomeTable", cols: ["id", "col_1", "col_2", "col_3"], rows: [
    [1,7920,"c4ca4238","00000001"],[2,15839,"c81e728d","00000002"],[3,23758,"eccbc87e","00000003"],
    [150,87851,"7ef605fc","00000150"],[1000,19001,"a9b7ba7078","00001000"],[10000,null,"b7a782741f","00010000"]] },
  ordermart: { name: "OrderMart（データマート）", cols: ["order_id", "receive_date"], rows: [
    ["00000001","2022-01-01"],["00000002","2022-01-01"],["00000003","2022-01-01"],["00500000","2024-01-01"],["01000000","2025-12-31"]] },
};

const ORDERS_NOTE = "一部の行だけを表示しています。本書の注文テーブル（1億件を想定）を1/100にした1,000,000件です。行はorder_idの順（＝受付順）に格納しています。件数の内訳は、基礎スライド「カーディナリティと選択率」の表を見てください。インデックスは主キーのほかに、process_flg、shop_id、(receive_date, order_id)、shop_nameに1つずつあります。shop_nameは、MySQLの実行計画が長くならないよう、本書のVARCHAR(256)をVARCHAR(32)にしました。";
const SHOPS_NOTE = "Shopsは901行で、一部の行だけを表示しています。主キーはshop_idです。";
const SOME_NOTE = "100,000行のうち、一部の行だけを表示しています。col_1は1〜100,000をばらばらに並べた整数（NUMERIC型）です。インデックスは、col_1にB-tree、col_3にハッシュインデックス（USING hash）があります。";
const MART_NOTE = "OrderMartは、Ordersのorder_idとreceive_dateだけをコピーした1,000,000行の表です。本書のリスト10.11はorder_idをCHAR(4)としていますが、元のOrdersに合わせてCHAR(8)にしました。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "plan", title: "この章の全体像" },
  { type: "intro", id: "defs", title: "ドリルのテーブルとインデックス" },
  { type: "intro", id: "btree", title: "B+treeの構造" },
  { type: "intro", id: "sel", title: "カーディナリティと選択率" },
  { type: "intro", id: "cf", title: "クラスタリングファクタ" },
  { type: "intro", id: "cant", title: "インデックスが使えない書き方" },
  { type: "intro", id: "multi", title: "複合インデックスとカバリング" },
  { type: "intro", id: "cope", title: "インデックスで解けないときの対処" },
  {
    type: "q", sec: "10.1 インデックスと言えばB-tree", title: "100万行から1行を探す", ref: "btree", table: ["orders", "shops"], tableNote: ORDERS_NOTE,
    prompt: "901行のShopsを、主キー（shop_id）のインデックスを使って1行探すと、PostgreSQLが読んだのは3ページだった。100万行のOrdersを、主キー（order_id）のインデックスを使って1行探すと、何ページ読む？",
    choices: [
      { text: "約20ページ（100万を2分探索する回数）", ok: false, note: "B+treeは1ページに数百のキーを持ち、1段で数百通りに枝分かれします。1回ずつ2つに分ける2分探索より、ずっと少ない段数で済みます。" },
      { text: "4ページ", ok: true, note: "インデックスの根・枝・葉の3ページと、テーブルの1ページです。Shopsはインデックスが2段なので3ページでした。行数が約1,100倍になっても、増えたのは1ページだけです。" },
      { text: "3,853ページ（主キーのインデックス全体）", ok: false, note: "インデックスを全部読むのではなく、根から葉まで1本の道をたどるだけです。" },
      { text: "約3,300ページ（Shopsの3ページ × 行数の比）", ok: false, note: "読むページは行数に比例しません。行数に比例するのはフルスキャンです。" },
    ],
    show: [{ q: "pk_orders", tag: "Orders（100万行）" }, { q: "pk_shops", tag: "Shops（901行）" }],
    takeaway: "<b>B+treeは浅い。データが1,000倍に増えても、木はだいたい1段深くなるだけ。</b>第1章で見た「フルスキャンはデータ量に比例し、インデックスは対数的にしか増えない」の正体です。MySQLの計画が「Rows fetched before execution」なのは、主キーで1行に決まる表を、計画を立てる段階で読んでしまうからです。",
  },
  {
    type: "q", sec: "10.1 インデックスと言えばB-tree", title: "ハッシュインデックスが使えるSQL", ref: "btree", table: ["sometable"], tableNote: SOME_NOTE,
    prompt: "SomeTableのcol_3には、ハッシュインデックスがある。PostgreSQLで、このインデックスを使えるSQLはどれ？",
    choices: [
      { q: "hash_gt", tag: "不等号", ok: false, note: "Seq Scanで736ページを全部読みました。ハッシュ値にはキーの大小の情報がないので、「より大きい」の範囲を探せません。" },
      { q: "hash_like", tag: "前方一致", ok: false, note: "前方一致も「'0000015'で始まる範囲」を探す検索なので、ハッシュでは探せません。Seq Scanです。" },
      { q: "hash_eq", tag: "等号", ok: true, note: "'00000150'をハッシュ値に変えれば、置き場所がすぐにわかります。Index Scan using idx_sometable_3で、3ページを読んだだけです。" },
      { q: "hash_range", tag: "BETWEEN", ok: false, note: "BETWEENも範囲検索です。Seq Scanで736ページを読みました。" },
    ],
    takeaway: "<b>ハッシュインデックスは等号専用。キーの順番を持たないので、範囲検索にも前方一致にも使えない。</b>B+treeが「万能型」と呼ばれるのは、これらにすべて使えるからです。なお、MySQLのInnoDBはUSING HASHと書いてもB-treeで作るので、MySQLの計画ではどのSQLもインデックスを使っています。",
  },
  {
    type: "q", sec: "10.2 インデックスを有効活用するには", title: "インデックスが効くSQL", ref: "sel", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "4つのSQLの条件の列には、どれもインデックスがある。本書の選択率の目安から見て、インデックスで速くなるのはどれ？",
    choices: [
      { q: "flg5", tag: "process_flg = '5'", ok: false, note: "830,000件で、選択率は83%です。PostgreSQLは、インデックスがあってもSeq Scanを選び、8,334ページを全部読みました。" },
      { q: "flg_ne", tag: "process_flg != '5'", ok: false, note: "170,000件で、選択率は17%です。否定形は選択率が大きくなりがちで、ここでもSeq Scanです。!=は「等しくない」で、<>と同じ意味です（実行計画には<>と表示されます）。" },
      { q: "flg1", tag: "process_flg = '1'", ok: true, note: "20,000件で、選択率は2%です。目安の5〜10%を下回っています。Bitmap Index Scanで行の場所を集め、テーブルの168ブロックだけを読みました（インデックスと合わせて187ページ）。" },
      { q: "shop_big", tag: "shop_id = '0001'", ok: false, note: "100,000件で、選択率は10%です。PostgreSQLはインデックスを使いましたが、読んだのは8,421ページで、全件を読む8,334ページより多くなりました（詳しくは「大店舗と小店舗」の問題）。" },
    ],
    takeaway: "<b>インデックスが役に立つのは、大きく絞り込める条件があるときだけ。</b>process_flgは値が5種類しかなくカーディナリティは低い列ですが、値の偏りが大きいので、少ない値で検索すれば絞り込めます。本書は、_flgや_statusのように状態を表す列は、インデックスに向かないことが多いと注意しています。",
  },
  {
    type: "q", sec: "10.3 インデックスによる性能向上が難しいケース", title: "インデックスが裏目に出る", ref: "sel", table: ["orders"], tableNote: ORDERS_NOTE, db: "my",
    prompt: "選択率83%のprocess_flg = '5'を、MySQL 8.0で実行したところ、オプティマイザはidx_Orders_flgを使う計画を選んだ。インデックスを使わずにテーブルを頭から全件読む場合と比べて、どうなると考えられる？",
    choices: [
      { text: "インデックスのほうが速い。'5'の行の始まりの場所に、すぐ飛べるから", ok: false, note: "始まりの場所に飛ぶのは速いのですが、そこから83万行を1行ずつ取りに行く必要があります。実際は、インデックスを使った版が728ミリ秒、全件を読ませた版が161ミリ秒でした。" },
      { text: "全件を読むほうが速い。値が5種類しかない列のインデックスは、等号の検索に使えないから", ok: false, note: "B-treeのインデックスは等号の検索に使えます。Q3のprocess_flg = '1'（選択率2%）は、同じインデックスで速くなりました。効くかどうかを決めるのは、列ではなく条件の選択率です。" },
      { text: "全件を読むほうが速い。83万行を1行ずつ取りに行く手間が、テーブルを頭から1回読む手間より大きいから", ok: true, note: "インデックスを使った版は728ミリ秒、インデックスを使わせないヒント（NO_INDEX）を付けて全件を読ませた版は161ミリ秒で、4倍以上遅くなりました。オプティマイザは、ヒットする行を498,533行と少なめに見積もって、インデックスを選んでいました（実際は830,000行）。" },
      { text: "ほぼ同じ。どちらの方法でも、返す行は同じ83万行だから", ok: false, note: "返す行は同じでも、そこにたどり着くまでの手間が違います。実際には、インデックスを使った版が4倍以上遅くなりました。" },
    ],
    show: [{ q: "flg5", tag: "ヒントなし" }, { q: "flg5_noindex", tag: "NO_INDEXヒント" }],
    takeaway: "<b>選択率の高い条件にインデックスがあると、オプティマイザがそれを選んで、かえって遅くなることがある。</b>本書が「裏目に出る」と呼ぶ状態です。同じ条件で、PostgreSQLはSeq Scanを選びました（実行計画タブでPostgreSQL 16に切り替え）。インデックスは、作れば必ず得をするものではありません。",
  },
  {
    type: "q", sec: "10.3 インデックスによる性能向上が難しいケース", title: "大店舗と小店舗", ref: "cf", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "同じSQLで、店舗IDだけを変えて実行した。小店舗0500（0.1%）はインデックスで1,004ページを読んだ。大店舗0001（10%）では、PostgreSQLもインデックスを使った。大店舗で読んだページは、インデックスを使わずに全件を読む場合（8,334ページ）と比べてどうだった？",
    choices: [
      { text: "約830ページ（全件の10分の1）", ok: false, note: "ヒットする行は10分の1ですが、読むページは10分の1になりません。" },
      { text: "約4,000ページ（全件の半分）", ok: false, note: "Heap Blocks: exact=8334とあり、テーブルのブロックは全部読んでいます。" },
      { text: "全件を読む場合より多い8,421ページ", ok: true, note: "大店舗の10万行はテーブル全体に散らばっているので、どのブロックにも大店舗の行があります。テーブルの8,334ブロックすべてに加えて、インデックスの87ページも読みました。" },
      { text: "全件を読む場合とまったく同じ8,334ページ", ok: false, note: "インデックスを読んだ87ページの分だけ多くなっています。" },
    ],
    show: [{ q: "shop_big", tag: "大店舗0001" }, { q: "shop_big_noindex", tag: "大店舗0001（全件を読ませた版）" }, { q: "shop_small", tag: "小店舗0500" }],
    takeaway: "<b>同じSQLでも、パラメータの値によって選択率が変わる。</b>小店舗ならインデックスが有利ですが、大店舗では全件を読むより多く読んでしまいます。オプティマイザが値ごとに計画を変えてくれればよいのですが、本書はそううまくいかない場合も多いと述べています。MySQLは大店舗でもインデックスを使い、全件を読ませた版の155ミリ秒に対して271ミリ秒かかりました。",
  },
  {
    type: "q", sec: "10.2 コラム　クラスタリングファクタ", title: "行数は近いのに、読むページが80倍違う", ref: "cf", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "受付日2025-12-01の注文（685行）と、小店舗0500の注文（1,000行）を検索した。行数は近いのに、PostgreSQLが読んだページは12と1,004で、80倍以上違った。理由は？",
    choices: [
      { text: "日付型の比較は、文字型の比較より速いから", ok: false, note: "比べているのは計算の速さではなく、読んだページの数です。" },
      { text: "受付日の行はテーブルの中で固まっていて、小店舗の行は散らばっているから", ok: true, note: "注文は受付順に追加されるので、同じ日の685行は隣り合った数ブロックに収まっています。小店舗の1,000行は1,000行おきに散らばっていて、1行ごとに別のブロックを読むことになります。" },
      { text: "受付日のインデックスのほうが、木の段数が少ないから", ok: false, note: "どちらのインデックスも100万行分で、段数は同じです。違いはテーブルの側で読んだブロックの数です。" },
      { text: "小店舗の検索はインデックスを使わなかったから", ok: false, note: "小店舗もBitmap Index Scan on idx_orders_shopでインデックスを使っています。" },
    ],
    show: [{ q: "date_day", tag: "受付日2025-12-01（685行）" }, { q: "shop_small", tag: "小店舗0500（1,000行）" }],
    takeaway: "<b>インデックスのキー順と行の物理的な並び順の一致度合いを、クラスタリングファクタと呼ぶ。</b>receive_dateはクラスタリングファクタが低く、shop_idは高い状態です。DBは行ではなくブロック単位で読むので、同じ件数でも読む量が大きく変わります。選択率の目安（5〜10%）がおおまかな目安でしかない理由の1つです。",
  },
  {
    type: "q", sec: "10.3 インデックスによる性能向上が難しいケース", title: "2025年12月の注文を探す", ref: "cant", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "受付日が2025年12月の注文（21,218行、約2%）を探したい。receive_dateのインデックスで範囲を絞り込めるSQLはどれ？",
    choices: [
      { q: "month_extract", tag: "EXTRACTで年と月を取り出す", ok: false, note: "索引列に関数を使っているので、インデックスを使えません。インデックスにあるのはreceive_dateの値で、EXTRACT(MONTH FROM receive_date)の値ではないからです。Seq Scanで8,334ページを読みました。" },
      { q: "month_cast", tag: "文字列に変えて前方一致", ok: false, note: "LIKEは前方一致ですが、その前にCASTで列を文字列に変えています。列を加工した時点で、インデックスを使えません。Seq Scanです。" },
      { q: "month_interval", tag: "列に1日を足す", ok: false, note: "索引列で演算しています。両辺から1日を引いて、列を裸のまま比べる形に直せば使えます。Seq Scanです。" },
      { q: "month_between", tag: "列をそのまま範囲で比べる", ok: true, note: "receive_dateを加工せずに、範囲の両端と比べています。Bitmap Index Scanで範囲を絞り、262ページを読んだだけです。MySQLもIndex range scanです。" },
    ],
    takeaway: "<b>インデックスを使うには、索引列を加工せず裸のまま比べる。</b>「年月で探す」は、関数で列を加工するのではなく、範囲の条件に書き換えます。4つのSQLの結果はどれも同じ21,218行ですが、読んだページは30倍以上違います。",
  },
  {
    type: "q", sec: "10.3 インデックスによる性能向上が難しいケース", title: "1.1倍すると109,890を超える行", ref: "cant", table: ["sometable"], tableNote: SOME_NOTE,
    prompt: "SomeTableから、col_1を1.1倍すると109,890を超える行（100行）を探したい。col_1のインデックスを使えるSQLはどれ？",
    choices: [
      { q: "calc_left", tag: "列を1.1倍して比べる", ok: false, note: "索引列で演算しています。インデックスにあるのはcol_1の値で、col_1 * 1.1の値ではありません。Seq Scanで736ページです。" },
      { q: "calc_right", tag: "右辺で割る", ok: true, note: "式を右辺に移したので、col_1を裸のまま99,900と比べられます。Bitmap Index Scanで103ページを読んだだけです。" },
      { q: "calc_round", tag: "ROUNDで丸める", ok: false, note: "列に演算と関数の両方を使っています。Seq Scanです。" },
      { q: "calc_minus", tag: "差を0と比べる", ok: false, note: "式を移項しても、col_1が式の中に残っていれば同じです。Seq Scanです。" },
    ],
    takeaway: "<b>式は、索引列の側ではなく、反対側（右辺）に寄せる。</b>本書のリスト10.7の書き換えそのものです。右辺の109890 / 1.1は、行ごとではなく1回だけ計算されます（MySQLの計画の&lt;cache&gt;）。",
  },
  {
    type: "q", sec: "10.3 インデックスによる性能向上が難しいケース", title: "「佐世保」で始まる店舗の注文", ref: "cant", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "店舗名が「佐世保」で始まる店舗（佐世保北店、佐世保中央店）の注文を探したい。結果が正しく、かつshop_nameのインデックスを使えるSQLはどれ？",
    choices: [
      { q: "like_mid", tag: "中間一致", ok: false, note: "結果が3,000行で、「JR佐世保駅前店」の注文まで入ってしまいます。そのうえ中間一致なので、インデックスを使えません（Seq Scan）。" },
      { q: "like_prefix", tag: "前方一致", ok: true, note: "前方一致なら、「佐世保」から始まるキーの範囲だけを探せます。PostgreSQLはIndex Scan using idx_orders_nameで2,000行を取り出しました。MySQLもIndex range scanです。" },
      { q: "like_substr", tag: "SUBSTRINGで先頭3文字", ok: false, note: "結果は正しい2,000行ですが、索引列に関数を使っているので、インデックスを使えません（Seq Scan）。" },
      { q: "like_position", tag: "POSITIONで位置を調べる", ok: false, note: "結果は正しい2,000行ですが、これも索引列に関数を使っています（Seq Scan）。MySQLの計画では、POSITIONがlocateに置き換わっています。" },
    ],
    takeaway: "<b>LIKEでインデックスを使えるのは前方一致だけ。</b>中間一致（'%佐世保%'）や後方一致（'%佐世保'）は、先頭の文字が決まらないので、どこから探せばよいかわかりません。本書のケース3のように、よく絞り込める条件でもフルスキャンになります。",
  },
  {
    type: "q", sec: "10.4 インデックスが使用できない場合どう対処するか", title: "2列のインデックスの列の順番", ref: "multi", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "次のSQLは、receive_date（受付日）が2025年12月の注文の、order_id（注文ID）だけを取り出す。このSQLのために2列のインデックスを作る。①WHERE句のreceive_dateの範囲を、インデックスで絞り込める ②SELECTするorder_idもインデックスに入っているので、テーブルを読まずに済む。①と②を両方満たすのはどれ？",
    code: "SELECT order_id\n  FROM Orders\n WHERE receive_date\n       BETWEEN DATE '2025-12-01'\n           AND DATE '2025-12-31';",
    choices: [
      { text: "(order_id, receive_date)", ok: false, note: "②は満たします（2列ともインデックスにある）。でも①を満たしません。インデックスはorder_idの順に並ぶので、receive_dateの条件からは、どこから読み始めればいいか決められません。インデックスを全部読むことになります。" },
      { text: "(receive_date, order_id)", ok: true, note: "①先頭のreceive_dateの順に並ぶので、12月の範囲を絞り込めます。②order_idもインデックスにあるので、テーブルを読みません。このドリルのidx_orders_dateがこの形で、PostgreSQLはIndex Only Scan（Heap Fetches: 0）で85ページを読んだだけでした。" },
      { text: "(receive_date, shop_id)", ok: false, note: "①は満たします（先頭がreceive_date）。でも②を満たしません。order_idがインデックスにないので、行ごとにテーブルを読みに行きます。" },
      { text: "(shop_id, order_id)", ok: false, note: "①を満たしません。条件のreceive_dateがインデックスにないので、絞り込みに使えません。" },
    ],
    show: [{ q: "cover_id", tag: "(receive_date, order_id)で実行" }],
    takeaway: "<b>複合インデックスは先頭の列の順に並ぶ。範囲で探す列を先頭に置き、取り出す列を後ろに足す。</b>電話帳が(姓, 名)の順だと、姓では探せても、名だけでは探せないのと同じです。本書のリスト10.14の(order_id, receive_date)は、絞り込み条件のないケース1のためのもので、インデックスを全部読む使い方です。",
  },
  {
    type: "q", sec: "10.4 インデックスが使用できない場合どう対処するか", title: "テーブルを読まずに答えられるSQL", ref: "multi", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "Ordersには、インデックス(receive_date, order_id)がある。受付日が2025年12月の注文を探す4つのSQLのうち、インデックスだけで答えられ、テーブルを読まずに済むのはどれ？",
    choices: [
      { q: "cover_shop", tag: "shop_idを取り出す", ok: false, note: "shop_idはインデックスにないので、行ごとにテーブルを読みます。PostgreSQLはBitmap Heap Scanで262ページを読みました。" },
      { q: "month_between", tag: "全列を取り出す", ok: false, note: "SELECT *には、インデックスにない列が含まれます。テーブルも読みます（262ページ）。" },
      { q: "cover_id_shop", tag: "order_idとshop_idを取り出す", ok: false, note: "列が1つでもインデックスになければ、テーブルを読みます。262ページです。" },
      { q: "cover_id", tag: "order_idだけを取り出す", ok: true, note: "SELECT句のorder_idも、WHERE句のreceive_dateも、インデックスにあります。PostgreSQLはIndex Only Scanで、Heap Fetches: 0、85ページでした。MySQLも「Covering index range scan」です。" },
    ],
    takeaway: "<b>SQLが使う列（SELECT句もWHERE句も）がすべてインデックスにあれば、テーブルを読まずに済む。これがインデックスオンリースキャン。</b>そのためのインデックスをカバリング・インデックスと呼びます。逆に、アプリの改修でSELECT句にshop_idを1列足しただけで、テーブルを読む計画に戻ります（85ページ→262ページ）。本書がこの技術を「ピーキー」と呼ぶ理由です。",
  },
  {
    type: "q", sec: "10.4 インデックスが使用できない場合どう対処するか", title: "検索画面の入力を制御する", ref: "cope",
    prompt: "Ordersの検索画面では、注文ID、店舗ID、店舗名、処理フラグ、受付日の期間を、ユーザーが自由に組み合わせて検索できる。選択率の悪い検索を防ぐ入力制御として、最も効果があるのはどれ？",
    choices: [
      { text: "処理フラグを必須入力にする", ok: false, note: "処理フラグは5種類しかなく、'5'を選べば83%がヒットします。必須にしても絞り込めません。" },
      { text: "店舗名は部分一致（'%…%'）で検索できるようにする", ok: false, note: "中間一致はインデックスを使えないので、逆効果です。" },
      { text: "店舗IDで検索するときは受付日も必須にし、期間は最大1か月までにする", ok: true, note: "大店舗でも、期間を1か月に限れば件数は大きく減ります。期間を短く限れるなら、月単位のパーティションも選べるようになります。本書が例に挙げる入力制御です。" },
      { text: "条件を何も入れなくても検索できるようにする", ok: false, note: "全件を返す検索を許すことになります。ユーザーが好む「完全フリーダム」の要件です。" },
    ],
    takeaway: "<b>インデックス設計は、テーブル定義とSQLだけを見ていてもできない。</b>どんな条件の組み合わせが来るかは、画面の設計で決まるからです。本書はインフラとアプリケーションの間の「深くて暗い川」を渡れと言います。性能試験で問題が見つかってから入力を制限すると「あとだしジャンケン」になるので、早い段階でユーザーと合意しておきます。",
  },
  {
    type: "q", sec: "10.4 インデックスが使用できない場合どう対処するか", title: "読む量を大きく減らせるデータマート", ref: "cope", table: ["orders"], tableNote: ORDERS_NOTE,
    prompt: "管理画面に毎日、「年・月・店舗ごとの注文件数」を表示している。今は100万行のOrdersを、毎回下のSQLで集計している。夜間バッチでデータマートを作り、画面はそこを読むように変えたい。画面に出る結果が同じで、読む量が最も減るのはどれ？",
    code: "SELECT EXTRACT(YEAR FROM receive_date),\n       EXTRACT(MONTH FROM receive_date),\n       shop_id, COUNT(*)\n  FROM Orders\n GROUP BY EXTRACT(YEAR FROM receive_date),\n          EXTRACT(MONTH FROM receive_date),\n          shop_id;",
    choices: [
      { text: "Ordersを全列そのままコピーしたマート（100万行・5列）", ok: false, note: "元のテーブルと大きさが変わらないので、読む量も変わりません。本書の注意点「データマートのサイズ」の典型です。毎回の集計もそのまま残ります。" },
      { text: "receive_dateとshop_idの2列だけをコピーしたマート（100万行・2列）", ok: false, note: "列は減りますが、行は100万行のままです。行ごとの管理情報は列を減らしても残るので、ページ数は3分の2ほどにしかなりません（2列のOrderMartは5,406ページ）。毎回の集計も残ります。" },
      { text: "年・月・店舗ごとの件数を、集計済みで持つマート（48か月×901店舗＝43,248行）", ok: true, note: "画面に出す結果そのものを、バッチで先に作っておく形です。行が100万から43,248に減り、PostgreSQLが読んだのは276ページでした（Ordersから集計すると8,334ページ）。MySQLも、約250ミリ秒が約6ミリ秒になりました。重い集計はバッチに移ります。" },
      { text: "process_flgが'1'（未処理）の注文だけをコピーしたマート（2万行）", ok: false, note: "小さくはなりますが、処理済みの注文が入っていないので、件数が正しく出ません。データマートには、そのSQLが必要とする行がすべて入っている必要があります。" },
    ],
    show: [{ q: "monthly_orders", tag: "Ordersから毎回集計" }, { q: "monthly_mart", tag: "集計済みのマートを読む" }, { q: "ordermart_all", tag: "参考：2列のOrderMartを全部読む" }],
    takeaway: "<b>データマートが大きく効くのは、行を減らせたとき。</b>列を削るだけでは、行の数と行ごとの管理情報が残ります。画面に出す集計結果そのものをバッチで作っておけば、行も列も大きく減らせます。その代わり、中身は次のバッチまで古いままです（次の問題）。",
  },
  {
    type: "q", sec: "10.4 インデックスが使用できない場合どう対処するか", title: "夜間バッチで作るデータマート", ref: "cope",
    prompt: "OrderMartを、毎晩2時の夜間バッチでOrdersから作り直している。今日の昼12時に受け付けた注文を、午後にOrderMartで検索すると、どうなる？",
    choices: [
      { text: "見つかる。OrdersにINSERTすると、OrderMartにも自動で反映されるから", ok: false, note: "OrderMartは、Ordersとは別のテーブルです。バッチで同期するまで、Ordersへの変更は届きません。" },
      { text: "見つからない。OrderMartの中身は、今朝2時の時点のままだから", ok: true, note: "これが、本書の注意点の1つ「データ鮮度」です。同期のサイクルを短くすれば新しくなりますが、そのぶん更新処理の負荷が増えます。鮮度がある程度落ちてもよいという要件が満たせないと、この手段は採用できません。" },
      { text: "エラーになる。同期前のマートは検索できないから", ok: false, note: "マートは普通のテーブルなので、いつでも検索できます。中身が古いだけです。" },
      { text: "見つかるが、検索が遅くなる", ok: false, note: "速さではなく、中身の新しさの問題です。" },
    ],
    takeaway: "本書が挙げるデータマートの注意点は4つです。<b>データ鮮度、データマートのサイズ、データマートの数（増えすぎると管理できない「ゾンビマート」）、バッチウィンドウ（作成と統計情報の収集にかかる時間）。</b>第9章のモデル変更と同じく、検索を速くする代わりに、同期と運用のコストを引き受けます。",
  },
  {
    type: "q", sec: "10.4 インデックスが使用できない場合どう対処するか", title: "画面も変えず、同期もしない対処", ref: "cope",
    prompt: "次のSQL（本書のケース3）が遅い。検索画面は変えられない。データの同期処理も増やしたくない。本書が示す対処はどれ？",
    code: "SELECT order_id, receive_date\n  FROM Orders\n WHERE shop_name LIKE '%佐世保%';",
    choices: [
      { text: "shop_nameに普通のインデックスを作る", ok: false, note: "中間一致なので、インデックスで範囲を絞り込めません。" },
      { text: "shop_nameにハッシュインデックスを作る", ok: false, note: "ハッシュは等号専用で、LIKEには使えません。" },
      { text: "order_idとreceive_dateだけのデータマートを作り、そこを検索する", ok: false, note: "shop_nameがないマートでは、この条件を検索できません。そもそもマートは同期処理が要ります。" },
      { text: "(order_id, shop_name, receive_date)のカバリング・インデックスを作る", ok: true, note: "本書のリスト10.18です。中間一致なので全部を読むことに変わりはありませんが、読む対象をテーブルから、SQLの3列だけを持つ小さなインデックスに変えられます。インデックスはDBMSが自動で更新するので、同期処理も要りません。" },
    ],
    takeaway: "<b>インデックスオンリースキャンは、データマートと同じく読む量を減らす技術で、しかもデータ同期が要らない。</b>本書はこれを、行指向のDBで擬似的にカラム指向（使う列だけを読む）を実現する方法と見ています。代わりに、更新の負荷が増える、定期的なリビルドが要る、SQLに列が増えると使えなくなる、といった注意点があります。",
  },
  { type: "end" },
];

// 基礎スライド用の小さな表。セルは値か { v, k, n }。k は ok（良い）、ng（悪い）、acc（注目）
const TONE = { ok: "var(--ok-soft)", ng: "var(--ng-soft)", acc: "var(--accent-soft)" };
// 折り返す表（狭い画面でも横にはみ出さない）。widths は列幅の%
function wt(cols, rows, widths) {
  const cell = (c, tag, i) => {
    const o = c !== null && typeof c === "object" ? c : { v: c };
    const bg = o.k ? `background:${TONE[o.k]};font-weight:600;` : "";
    return `<${tag} style="white-space:normal;vertical-align:top;${bg}${widths ? `width:${widths[i]}%;` : ""}">${o.v}</${tag}>`;
  };
  return `<div class="tbl-wrap" style="max-height:none"><table style="table-layout:fixed;width:100%">
    <thead><tr>${cols.map((c, i) => cell(c, "th", i)).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map((c, i) => cell(c, "td", i)).join("")}</tr>`).join("")}</tbody></table></div>`;
}

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
const CLAIM_OF = { btree: 1, sel: 1, cf: 1, cant: 1, multi: 2, cope: 2 };
const INTRO_KICKER = s => {
  const no = CLAIM_OF[s.id];
  if (!no) return "";
  const t = no === 1 ? { k: "acc", s: "インデックスが効くかは、選択率しだい" } : { k: "ok", s: "効かないときは、読む量そのものを減らす" };
  return `<div style="display:inline-block;background:${TONE[t.k]};border-radius:999px;padding:4px 14px;margin:4px 0 6px;font-size:14px;font-weight:700">主張${no}「${t.s}」の基礎</div>`;
};

// 各スライドの前提
const premise = rows => `<div style="border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:0 0 14px;background:var(--surface)">
    <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:15px;line-height:1.6">
      ${rows.map(([h, b]) => `<div style="font-weight:700;color:var(--muted);white-space:nowrap">${h}</div><div>${b}</div>`).join("")}
    </div>
  </div>`;

// 基礎スライドのコードは、横スクロールさせずに折り返して全文を見せる
const code = s => `<pre style="white-space:pre-wrap;overflow-wrap:anywhere;overflow-x:visible">${esc(s)}</pre>`;

// 図：キーを並べたノード
const node = (keys, k) => `<span style="display:inline-flex;border:1.5px solid var(--ink);border-radius:5px;overflow:hidden;font-family:var(--f-code);font-size:13px;background:${k ? TONE[k] : "var(--surface)"}">${keys.map((x, i) => `<span style="padding:2px 9px;${i ? "border-left:1px solid var(--line)" : ""}">${x}</span>`).join("")}</span>`;

// B+treeの図：根→葉→テーブル。6を探す道筋を accent で描く
function treeSvg() {
  const W = 32, ink = "var(--ink)", mut = "var(--muted)", acc = "var(--accent)";
  const box = (x, y, keys, on, hit) => keys.map((k, i) =>
    `<rect x="${x + i * W}" y="${y}" width="${W}" height="28" rx="3" style="fill:${on ? "var(--accent-soft)" : "var(--surface)"};stroke:${ink};stroke-width:1.5"/>` +
    `<text x="${x + i * W + W / 2}" y="${y + 19}" text-anchor="middle" style="fill:${ink};font:${k === hit ? 700 : 400} 13px var(--f-code)">${k}</text>`).join("");
  const line = (x1, y1, x2, y2, on, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${on ? acc : mut};stroke-width:${on ? 2.5 : 1.2}${dash ? ";stroke-dasharray:3 3" : ""}"/>`;
  const txt = (x, y, s, anchor, on) => `<text x="${x}" y="${y}" text-anchor="${anchor}" style="fill:${on ? acc : mut};font:${on ? 700 : 400} 11px var(--f-body)">${s}</text>`;
  // 葉：A(1,3) x=14、B(4,6) x=138、C(7,9,10) x=236
  const leaves = [[14, ["1", "3"]], [138, ["4", "6"]], [236, ["7", "9", "10"]]];
  const ptrs = leaves.flatMap(([x, ks]) => ks.map((k, i) => line(x + i * W + W / 2, 130, x + i * W + W / 2, 172, k === "6", k !== "6"))).join("");
  return `<svg viewBox="0 0 364 212" style="width:100%;max-width:440px;display:block;margin:0 auto" role="img" aria-label="根に4と7、葉に1・3、4・6、7・9・10が並ぶB+tree。6を探すときは、根から真ん中の葉へ進み、ポインタでテーブルの行を読む">
    ${txt(2, 30, "根", "start")}${txt(2, 118, "葉", "start")}
    <g transform="translate(18,0)">
    ${line(140, 40, 46, 100)}${line(170, 40, 170, 100, true)}${line(200, 40, 284, 100)}
    ${txt(86, 70, "4未満", "end")}${txt(176, 74, "4以上7未満", "start", true)}${txt(252, 64, "7以上", "start")}
    ${box(138, 12, ["4", "7"])}
    ${leaves.map(([x, ks], i) => box(x, 100, ks, i === 1, "6")).join("")}
    ${txt(108, 118, "⇄", "middle")}${txt(219, 118, "⇄", "middle")}${txt(108, 144, "隣とつながる", "middle")}
    ${ptrs}
    <rect x="14" y="172" width="318" height="28" rx="3" style="fill:var(--surface);stroke:${mut};stroke-width:1.2"/>
    ${txt(173, 190, "テーブル（行の実体）。点線＝各キーが持つ行の場所（ポインタ）", "middle")}
    </g>
  </svg>`;
}

// データマートの図：Ordersから2列だけを夜間バッチでコピーし、SQLはOrderMartを読む
function martSvg() {
  const ink = "var(--ink)", mut = "var(--muted)", acc = "var(--accent)";
  const cells = (x, y, w, names, on) => names.map((n, i) =>
    `<rect x="${x + i * w}" y="${y}" width="${w}" height="26" style="fill:${on.includes(i) ? "var(--accent-soft)" : "var(--surface)"};stroke:${ink};stroke-width:1.2"/>` +
    `<text x="${x + i * w + w / 2}" y="${y + 17}" text-anchor="middle" style="fill:${ink};font:${on.includes(i) ? 700 : 400} 9.5px var(--f-code)">${n}</text>`).join("");
  const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "start"}" style="fill:${o.c || ink};font:${o.w || 400} ${o.s || 12}px var(--f-body)">${s}</text>`;
  return `<svg viewBox="0 0 360 206" style="width:100%;max-width:560px;display:block" role="img" aria-label="5列のOrdersから、order_idとreceive_dateの2列だけを夜間バッチでコピーしてOrderMartを作り、SQLはOrderMartを読む図">
    <defs><marker id="martArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:${mut}"/></marker>
      <marker id="martArrowAcc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:${acc}"/></marker></defs>
    ${txt(10, 14, "Orders（元のテーブル）", { w: 700 })}
    ${cells(10, 22, 68, ["order_id", "shop_id", "shop_name", "receive_date", "process_flg"], [0, 3])}
    ${txt(10, 64, "5列 × 100万行 ＝ 8,334ページ", { c: mut })}
    <line x1="80" y1="72" x2="80" y2="128" style="stroke:${mut};stroke-width:1.5" marker-end="url(#martArrow)"/>
    ${txt(92, 94, "夜間バッチで、使う2列だけをコピー", { w: 700, s: 11.5 })}
    ${txt(92, 110, "（毎晩1回。次のバッチまで中身は古いまま）", { c: mut, s: 11 })}
    ${txt(10, 146, "OrderMart（データマート）", { w: 700, c: acc })}
    ${cells(10, 154, 90, ["order_id", "receive_date"], [0, 1])}
    ${txt(10, 196, "2列 × 100万行 ＝ 5,406ページ", { c: mut })}
    <rect x="236" y="150" width="116" height="34" rx="6" style="fill:var(--surface);stroke:${acc};stroke-width:1.5"/>
    ${txt(294, 165, "ケース1のSQL", { a: "middle", w: 700, c: acc, s: 11.5 })}
    ${txt(294, 179, "ここだけを読む", { a: "middle", c: acc, s: 11 })}
    <line x1="234" y1="167" x2="196" y2="167" style="stroke:${acc};stroke-width:2" marker-end="url(#martArrowAcc)"/>
  </svg>`;
}

// クラスタリングファクタの図：1ブロック4行。hit の値の行を色付けする
const blocks = (rows, hit) => `<div style="display:flex;flex-direction:column;gap:4px">${rows.map((r, i) => {
  const has = r.includes(hit);
  return `<div style="display:flex;align-items:center;gap:8px"><span class="hint" style="white-space:nowrap">ブロック${"ABC"[i]}</span>${node(r.map(v => v === hit ? `<b>${v}</b>` : v), has ? "acc" : "")}<span class="hint" style="white-space:nowrap">${has ? "読む" : "読まない"}</span></div>`;
}).join("")}</div>`;

// 折り返す2列の表。値が空の行は見出しとして出す
const kv = (rows, head) => `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:4px 12px;font-size:14px;line-height:1.5;border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin:0 0 10px;background:var(--surface)">${
  head ? head.map(h => `<div style="font-size:12px;color:var(--muted)">${h}</div>`).join("") : ""}${
  rows.map(([k, v]) => v === "" ? `<div style="grid-column:1/-1;font-weight:700;margin-top:6px">${k}</div>`
    : `<div style="font-family:var(--f-code);overflow-wrap:anywhere">${k}</div><div style="overflow-wrap:break-word">${v}</div>`).join("")}</div>`;

// 書き方の良し悪しを並べる行
const pair = (ng, ok, why) => `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:start">
    <div><div class="label" style="color:var(--ng)">✕ 使えない</div>${code(ng)}</div>
    <div><div class="label" style="color:var(--ok)">○ 使える</div>${code(ok)}</div>
  </div><p class="hint" style="margin:2px 0 10px">${why}</p>`;

const INTRO_BODY = {
  plan: () => {
    const card = (no, tone, head, sub, secs) => `<div class="col" style="background:${TONE[tone]};border-radius:12px;padding:22px 24px">
        <div style="font-size:15px;font-weight:700;color:var(--muted);letter-spacing:.08em">主張${no}</div>
        <div style="font-size:30px;font-weight:800;line-height:1.35;margin:8px 0 12px">${head}</div>
        <div style="font-size:17px;line-height:1.6">${sub}</div>
        <div style="font-size:14px;color:var(--muted);margin-top:14px">${secs}</div>
      </div>`;
    return `${premise([["前提", "インデックスは、アプリケーションを変えずにデータベースの側だけで性能を上げられる、最もポピュラーなチューニング手段。"], ["このドリル", "本書の注文テーブル（1億件）を1/100の100万件にしてPostgreSQL 16とMySQL 8.0に入れ、選択肢のSQLを実際に流した。選択肢を押すと、そのときの実行計画が出る。"], ["見るところ", "実行計画の上に出る「読んだページ」の数（PostgreSQLの結果だけに出る）。DBはデータを8KBのページ単位で読む。100万件の注文テーブルは8,334ページあり、全件を読めばこの全部を読む。インデックスでどこまで減るかで、効いたかどうかがわかる。"]])}
    <div class="grid">
      ${card(1, "acc", "インデックスが効くかは、選択率しだい", "B+treeは万能型の秀才。でも、大きく絞り込める条件がなければ役に立たず、かえって遅くなることもある。書き方によっては使えない。", "10.1〜10.3 ／ スライド3〜6")}
      ${card(2, "ok", "効かないときは、読む量そのものを減らす", "画面の入力を制御する、データマートを作る、インデックスだけを読ませる。どれもストレージから読む量（I/O）を減らす工夫。", "10.4 ／ スライド7〜8")}
    </div>`;
  },
  defs: () => `${premise([["中身", "インデックスに入っているのは、CREATE INDEXのカッコに書いた列の値と、その行の場所だけ。カッコに書いていない列や、列を計算した結果（年、文字数、1.1倍など）は入っていない。"], ["だから", "WHERE句で列をそのまま比べれば、インデックスの中の値と突き合わせられる。列を関数や計算で加工すると、突き合わせる相手がインデックスにない。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>問題を解くときは、条件の列にインデックスがあるか（各問題のテーブルの説明に書いてある）、その列をそのまま比べているかを見る。</b></p>
    <div class="grid">
      <div class="col">
        <div class="label">例：受付日のインデックスを作るSQL</div>
        ${code("CREATE INDEX idx_Orders_date\n  ON Orders (receive_date, order_id);")}
        ${kv([
          ["idx_Orders_date", "インデックスの名前。実行計画に出てくる"],
          ["ON Orders", "Ordersテーブルの索引を作る"],
          ["(receive_date, order_id)", "<b>この2列の値を入れる。並び順もこの順</b>"],
        ])}
      </div>
      <div class="col">
        <div class="label">できたインデックスの中身（実データ）。行の場所は(ページ番号, そのページの何番目)</div>
        ${vt(["receive_date", "order_id", "行の場所"], [
          ["2025-11-30", "00978782", "(8156, 62)"],
          [{ v: "2025-12-01", k: "acc" }, { v: "00978783", k: "acc" }, { v: "(8156, 63)", k: "acc" }],
          [{ v: "2025-12-01", k: "acc" }, { v: "00978784", k: "acc" }, { v: "(8156, 64)", k: "acc" }],
          [{ v: "⋮", k: "acc" }, { v: "⋮", k: "acc" }, { v: "⋮", k: "acc" }],
          [{ v: "2025-12-01", k: "acc" }, { v: "00979467", k: "acc" }, { v: "(8162, 27)", k: "acc" }],
          ["2025-12-02", "00979468", "(8162, 28)"],
        ])}
        <ul class="points">
          <li>入っているのは、カッコに書いたreceive_dateとorder_idの値と、行の場所（テーブルのページ番号, そのページの何番目）だけです。Ordersにあるshop_idやprocess_flgの値は入っていません。</li>
          <li>receive_dateの順に並び、同じ日の中はorder_idの順です。「2025年12月」（色の部分）はひと続きの範囲なので、始まりと終わりを指定すれば（BETWEENなど）、そこだけを読めます。</li>
          <li>EXTRACT(MONTH FROM receive_date)の値「12」は、どこにも入っていません。だから全行について計算して確かめるしかありません。</li>
        </ul>
      </div>
    </div>`,
  btree: () => `${premise([["何のため", "テーブルの全行を読まずに、欲しい行の場所を探すための索引。本の巻末の索引と同じで、キーの値の順に並んでいる。テーブルとは別に置かれる。"], ["前の表", "前のスライドの表（受付日・注文ID・行の場所）は、この木の「葉」に並んでいるもの。idx_Orders_dateは全部で3,853ページもあるので、葉の上に根と枝を作り、目的の葉まで数ページでたどり着けるようにしている。この「形」と「たどり方」がB+tree。"], ["種類", "インデックスには主にB-tree、ビットマップ、ハッシュの3種類があり、B-treeはそのうちの1つ。CREATE INDEXで種類を指定しなければB-treeになる。多くのDBMSは、B-treeを改良したB+treeを使う。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>B+treeは浅くて、キーの順に並んでいる。だから、等号でも範囲でも速く、データが増えても遅くなりにくい。</b></p>
    <div class="grid">
      <div class="col">
        <div class="label">B+treeの形（本書の図10.1を簡略化）。色の道筋は「6を探す」例</div>
        <div style="border:1px solid var(--line);border-radius:8px;padding:10px;background:var(--bg)">
          ${treeSvg()}
          <ol class="points" style="margin-top:6px">
            <li><b>根</b>の「4」「7」は道しるべです。6は4以上7未満なので、真ん中の枝に進みます。</li>
            <li><b>葉</b>には、すべてのキーが小さい順に並んでいます。ここで6を見つけます。</li>
            <li>葉のキー6が持つ<b>ポインタ</b>（行の場所）をたどって、<b>テーブル</b>の行を1ページ読みます。</li>
          </ol>
        </div>
        <ul class="points">
          <li>根から、どの葉までも同じ段数でたどり着きます（バランスの取れた木）。どのキーでも検索の速さがそろいます。</li>
          <li>葉はキーの順に並び、隣どうしがつながっています。範囲検索は、始まりの葉を見つけたら横にたどるだけです。</li>
          <li>キーがソート済みなので、MAXやORDER BYのソートを省けることもあります。</li>
        </ul>
        <div class="label">B-treeとB+treeの違い</div>
        ${wt(["", "B-tree", "B+tree"], [
          ["キーと行の場所", "根・枝・葉のどこにでもある", { v: "すべて葉にある。根と枝は道しるべだけ", k: "acc" }],
          ["葉どうし", "つながっていない", { v: "隣の葉とつながっている", k: "acc" }],
          ["範囲検索", "木を上り下りしながら集める", { v: "始まりの葉を探したら、横にたどるだけ", k: "acc" }],
        ], [26, 37, 37])}
        <p class="hint" style="margin:6px 0 0">DBMSで「B-tree」と呼ばれているインデックスも、中身はたいていB+treeの形です。</p>
      </div>
      <div class="col">
        <div class="label">1行を探すときに読むページ</div>
        ${code("読むページ ＝ インデックスの段数（根から葉まで） ＋ テーブルの1ページ")}
        <ul class="points">
          <li>1ページには数百のキーが入るので、1段で数百通りに枝分かれします。</li>
          <li>1段増えるごとに、探せる行数が数百倍になります。目安は、数百行までなら1段、数万〜十数万行までなら2段、数千万行までなら3段、数十億行までなら4段です。</li>
          <li>フルスキャンはデータ量に比例して増えますが、インデックスは段数の分しか増えません（第1章の損益分岐点の話）。</li>
        </ul>
        <div class="label">インデックスの主な3種類（B-treeはその1つ）</div>
        ${wt(["種類", "得意", "苦手"], [
          [{ v: "B-tree（B+tree）", k: "acc" }, "等号、不等号、範囲、前方一致", "絞り込めない条件"],
          ["ビットマップ", "値の種類が少ない列。BI/DWH", "更新（オーバーヘッドが大きい）"],
          ["ハッシュ", "等号（=）だけ", "キーの順番を持たないので、範囲・不等号・前方一致はできない"],
        ], [30, 33, 37])}
      </div>
    </div>`,
  sel: () => `${premise([["カーディナリティ", "列の値の種類の多さ。一意キーの列が最も高く、値が1種類しかない列が最も低い。"], ["選択率", "条件でテーブル全体の何%に絞り込めるか（ヒットする行数÷全体の行数）。小さいほどよく絞り込める。"], ["目安", "カーディナリティが高く、選択率が5〜10%未満の条件なら、インデックスを作る価値がある（かもしれない）。それより高いとフルスキャンのほうが速い可能性が高い。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>インデックスが効くのは、少ない行に絞り込める条件があるときだけ。</b>選択率が高いのにインデックスを使うと、行を1つずつ取りに行くので、テーブルを頭から読むより遅くなります。本書はこれを、インデックスが「裏目に出る」と言います。</p>
    <div class="grid">
      <div class="col">
        <div class="label">このドリルのOrders（全1,000,000行）の件数</div>
        ${vt(["列（値の種類）", "条件", "件数", "選択率"], [
          ["order_id（1,000,000）", "1つの注文ID", "1", { v: "0.0001%", k: "ok" }],
          ["receive_date（1,461日）", "1日", "約685", { v: "約0.07%", k: "ok" }],
          ["", "1か月", "約21,000", { v: "約2%", k: "ok" }],
          ["shop_id（901店舗）", "小店舗（0002〜0901）", "各1,000", { v: "0.1%", k: "ok" }],
          ["", "大店舗（0001）", "100,000", { v: "10%", k: "ng" }],
          ["process_flg（5種類）", "'1'", "20,000", { v: "2%", k: "ok" }],
          ["", "'2'、'3'、'4'", "各50,000", { v: "5%", k: "acc" }],
          ["", "'5'", "830,000", { v: "83%", k: "ng" }],
        ])}
      </div>
      <div class="col">
        <div class="label">同じSQLでも、選択率は入力しだいで変わる</div>
        ${code("WHERE receive_date BETWEEN :start_date AND :end_date\n-- 1日を指定すれば約0.07%、1年を指定すれば約25%\n\nWHERE shop_id = :sid\n-- 小店舗なら0.1%、大店舗なら10%")}
        <ul class="points">
          <li>オプティマイザが値ごとに、インデックスかフルスキャンかを選び分けてくれればよいのですが、うまくいかないことも多くあります。</li>
          <li>_flgや_statusのような状態を表す列は値の種類が少なく、インデックスに向かないことが多い列です。ただし偏りが大きければ、少ない値では絞り込めます。</li>
          <li>閾値は、ストレージが速くなるにつれて下がる傾向にあります（昔は20%と言われた時代もありました）。</li>
        </ul>
      </div>
    </div>`,
  cf: () => `${premise([["何のこと", "インデックスのキーの順番と、テーブルの行がストレージ上に並んでいる順番の一致度合い（本書のコラム）。"], ["なぜ効くか", "DBは行ではなく、ブロック（ページ）単位でストレージから読む。欲しい行が少数のブロックに固まっていれば、読むブロックも少ない。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>クラスタリングファクタが低い（並び順が一致している）ほど、インデックスで読むページが少なくて済む。</b>同じ件数を取り出しても、行の並び方しだいで読む量は何十倍も変わります。</p>
    <div class="grid">
      <div class="col">
        <div class="label">1ブロックに4行。値が1の行（4行）を探す</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px">
          <div><div style="font-weight:700;margin-bottom:6px">低い（並び順が一致）</div>${blocks([[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3]], 1)}<p class="hint" style="margin-top:6px">読むブロックは1つ。</p></div>
          <div><div style="font-weight:700;margin-bottom:6px">高い（ばらばら）</div>${blocks([[2, 1, 3, 2], [1, 3, 1, 2], [3, 2, 1, 3]], 1)}<p class="hint" style="margin-top:6px">4行しかないのに、全ブロックを読む。</p></div>
        </div>
      </div>
      <div class="col">
        <div class="label">このドリルのOrdersでは</div>
        ${vt(["列", "行の並び方", "クラスタリングファクタ"], [
          ["receive_date", "注文は受付順に追加されるので、同じ日の行は隣り合ったブロックに固まっている", { v: "低い", k: "ok" }],
          ["shop_id", "1つの店舗の注文は毎日少しずつ来るので、行がテーブル全体に散らばっている", { v: "高い", k: "ng" }],
        ])}
        <ul class="points">
          <li>選択率の目安（5〜10%）は、あくまでおおまかな目安です。行が散らばっていれば、もっと少ない件数でもフルスキャンに負けます。</li>
          <li>主キーにクラスタ化インデックスを作るDBMS（SQL Server、MySQLのInnoDB）では、行が主キーの順に並びます。</li>
          <li>Db2やOracleでは、この指標をカタログビューで確認できます。</li>
        </ul>
      </div>
    </div>`,
  cant: () => `${premise([["状況", "よく絞り込める条件なのに、書き方のせいでインデックスを使えないことがある（本書のケース3）。"], ["原則", "インデックスに入っているのは列の値そのもの。列を加工した値（演算や関数の結果）は入っていないので、それと比べる条件には使えない。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>インデックスの列は、加工せずに裸のまま比べる。</b>加工が必要なら、反対側（定数の側）に寄せます。</p>
    <div class="grid">
      <div class="col">
        <div class="label">LIKE述語</div>
        ${pair("WHERE shop_name LIKE '%佐世保%'\nWHERE shop_name LIKE '%佐世保'", "WHERE shop_name LIKE '佐世保%'", "インデックスを使えるのは前方一致だけ。中間一致・後方一致は、先頭の文字が決まらないので探し始められない。")}
        <div class="label">索引列で演算</div>
        ${pair("WHERE col_1 * 1.1 > 100", "WHERE col_1 > 100 / 1.1", "式を右辺に移せば、列を裸のまま比べられる（本書のリスト10.7）。")}
      </div>
      <div class="col">
        <div class="label">索引列に関数</div>
        ${pair("WHERE EXTRACT(\n  YEAR FROM\n  receive_date\n) = 2025", "WHERE receive_date\nBETWEEN\nDATE '2025-01-01'\nAND\nDATE '2025-12-31'", "インデックスにあるのはreceive_dateの値で、EXTRACT(…)の計算結果ではない。使えるのはBETWEENだからではなく、列を加工せずにそのまま比べているから。「2025年」を「2025-01-01〜2025-12-31の範囲」に言い換える。LENGTH(col_1)やCASTで型を変えるのも同じで使えない。")}
        <div class="label">そのほか</div>
        <ul class="points">
          <li><b>IS NULL</b>：インデックスにNULLを入れないDBMS（Oracleなど）では、インデックスで探せない（本書の「原則」）。PostgreSQLやMySQLはNULLも入れるので使える。</li>
          <li><b>否定形（&lt;&gt;、!=、NOT IN）</b>：使えないわけではないが、選択率が大きくなりがちで、使うメリットがない。</li>
        </ul>
      </div>
    </div>`,
  multi: () => `${premise([["複合インデックス", "2つ以上の列で作るインデックス。先頭の列の順に並び、先頭が同じ値の中では2つ目の列の順に並ぶ。"], ["カバリング", "SQLが使う列をすべて持つインデックスを、カバリング・インデックスと呼ぶ。テーブルを読まずにインデックスだけで答えられる（インデックスオンリースキャン）。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>絞り込みに使う列を先頭に置く。SELECT句とWHERE句の列がすべてインデックスにあれば、テーブルは読まない。</b></p>
    <div class="grid">
      <div class="col">
        <div class="label">複合インデックスは電話帳と同じ</div>
        ${vt(["(姓, 名)の順の電話帳", "探せるか"], [
          ["姓が「佐藤」の人", { v: "探せる（佐藤の範囲が固まっている）", k: "ok" }],
          ["姓が「佐藤」で、名が「花子」の人", { v: "探せる", k: "ok" }],
          ["名が「花子」の人", { v: "探せない（全ページに散らばる）", k: "ng" }],
        ])}
        <p class="hint">インデックス(receive_date, order_id)なら、receive_dateの範囲で探せる。(order_id, receive_date)だと、receive_dateの範囲は全体に散らばるので、インデックスを全部読むことになる。</p>
      </div>
      <div class="col">
        <div class="label">インデックスオンリースキャン</div>
        ${vt(["", "通常のインデックススキャン", "インデックスオンリースキャン"], [
          ["読むもの", "インデックス ＋ テーブル", { v: "インデックスだけ", k: "ok" }],
          ["条件", "WHERE句の列がインデックスにある", "SQLのすべての列がインデックスにある"],
          ["計画の表示", "Index Scan / Index lookup", "Index Only Scan / Covering index"],
        ])}
        <ul class="points">
          <li>インデックスはテーブルの一部の列しか持たないので、テーブルより小さく、読む量が減ります。</li>
          <li>SQLに1列でもインデックスにない列が加わると、テーブルを読む計画に戻ります。</li>
          <li>MySQLのInnoDBでは、どのインデックスも主キーの値を持っているので、主キーの列は書かなくてもカバーされます。</li>
        </ul>
      </div>
    </div>`,
  cope: () => `${premise([["困ること", "絞り込み条件がない（ケース1）、ほとんど絞り込めない（ケース2）、インデックスが使えない（ケース3）SQL。インデックスを作っても速くならない。"], ["対処", "アプリケーションの設計で対処する王道（外部設計、データマート）と、あくまでインデックスにこだわる飛び道具（インデックスオンリースキャン）がある。"]])}
    <p class="takeaway" style="margin:0 0 14px"><b>どの対処も、ストレージから読む量を減らすための工夫。</b>代わりに、使い勝手、データの鮮度、運用、保守性のどれかを引き換えにします。</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">
      ${[
        ["外部設計（UI）", "画面で必須入力や期間の上限を決める（例：店舗IDで検索するなら受付日も必須、期間は1か月まで）", "選択率の良い条件が必ず付く", "ユーザーの自由度。開発の早い段階でユーザーと合意する必要がある"],
        ["データマート", "必要な列と行だけの小さなテーブルを、元のテーブルからコピーして作る", "読むテーブルが小さい", "①データ鮮度（同期するまで中身が古い）②サイズ（元と変わらなければ速くならない）③数（増えすぎると管理できない）④バッチウィンドウ（作成と統計情報の収集に時間がかかる）"],
        ["インデックスオンリースキャン", "SQLの列をすべて含むカバリング・インデックスを作る", "テーブルを読まず、小さなインデックスだけを読む。中間一致のように全部を読むしかない条件でも、読む対象が小さくなる", "更新の負荷が増える、定期的なリビルドが要る、列数に上限がある、SQLに列が増えると使えない。ただし同期処理は要らない（インデックスはDBMSが自動で更新する）"],
      ].map(([name, act, why, cost]) => `<div style="border:1px solid var(--line);border-radius:8px;padding:12px;background:var(--surface);display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.6">
        <div style="font-weight:700;color:var(--accent);font-size:15px">${name}</div>
        <div><span class="hint">やること</span><br>${act}</div>
        <div><span class="hint">読む量が減る理由</span><br>${why}</div>
        <div><span class="hint">引き換えになるもの（本書の注意点）</span><br>${cost}</div>
      </div>`).join("")}
    </div>
    <div class="label" style="margin-top:16px">データマートのイメージ（ドリルのテーブルで描いたもの）</div>
    <div style="border:1px solid var(--line);border-radius:8px;padding:12px;background:var(--bg)">${martSvg()}</div>
    <ul class="points" style="margin-top:10px">
      <li>列を3つ減らしても、行は100万行のままです。どの行にも付く管理情報（PostgreSQLでは1行24バイト）は残るので、ページ数は約35%しか減りません。</li>
      <li>データマートが大きく効くのは、<b>行そのものを減らせるとき</b>です。たとえば、画面に出す集計結果（GROUP BYの結果）を先に作っておく、必要な期間の行だけを入れる、などです。</li>
      <li>ただし、そのSQLが必要とする行が欠けていると、結果が正しく出ません。</li>
    </ul>
    <p class="hint" style="margin-top:10px">本書のコラムは、インデックスオンリースキャンを、行指向のDBの上で「使う列だけを読む」カラム指向のDBを擬似的に実現する方法と見ています。</p>`,
};

const CH = {
  no: 10,
  store: "sql-jissen-ch10-drill-v2",
  introEyebrow: "",
  h1: "インデックスを使いこなす<br>秀才の弱点",
  lede: () => `B+treeの仕組み、選択率とクラスタリングファクタ、インデックスが使えない書き方、インデックスが効かないときの対処を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、100万行の注文テーブルで取った実行計画が表示されます。インデックスで「読んだページ」がどれだけ減るかに注目してください。`,
  points: [
    "B+treeインデックスは便利だが、うまく速くなるかはカーディナリティと選択率しだい。",
    "選択率をコントロールするには、UI設計まで踏み込む必要がある。",
    "選択率の高いケースを救う技術が、データマートとインデックスオンリースキャン。",
    "インデックスによる性能改善も、結局はI/Oのコストを減らすための努力の一つ。",
  ],
};
