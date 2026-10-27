const T = {
  weights: { name: "Weights（体重）", cols: ["student_id", "weight"], rows: [
    ["A100",50],["A101",55],["A124",55],["B343",60],["B346",72],["C563",72],["C345",72]] },
  weights_even: { name: "WeightsEven（体重・偶数）", cols: ["student_id", "weight"], rows: [
    ["A100",50],["A101",55],["A124",55],["B343",60],["B346",72],["C563",72],["C345",72],["C478",90]] },
  weights_ex8: { name: "WeightsEx8（演習問題8の体重）", cols: ["student_id", "weight"], rows: [
    ["B346",80],["C563",70],["A100",70],["A124",60],["B343",60],["C345",60]] },
  weights2: { name: "Weights2（体重2）", cols: ["class", "student_id", "weight"], rows: [
    [1,"100",50],[1,"101",55],[1,"102",56],[2,"100",60],[2,"101",72],[2,"102",73],[2,"103",73]] },
  weights3: { name: "Weights3（体重3・連番の列を埋めたい）", cols: ["class", "student_id", "weight", "seq"], rows: [
    [1,"100",50,null],[1,"101",55,null],[1,"102",56,null],[2,"100",60,null],[2,"101",72,null],[2,"102",73,null],[2,"103",73,null]] },
  numbers: { name: "Numbers（連番）", cols: ["num"], rows: [[1],[3],[4],[7],[8],[9],[12]] },
};

const WEIGHTS_NOTE = "主キーはstudent_idです。行はこの順に格納されています。";
const WEIGHTS2_NOTE = "主キーは(class, student_id)の2列です。";
const EVEN_NOTE = "本書は偶数の例として、Weightsに1行追加した表を使います。このドリルでは別の表WeightsEvenにしています。中央値は60と72の平均の66です。";
const EX8_NOTE = "本書の演習問題8は、Weightsの中身をこの6行に入れ替えます。このドリルでは別の表WeightsEx8にしています。行はこの順に格納されていて、中央値は60と70の平均の65です。";
const NUMBERS_NOTE = "主キーはnumです。欠番は、座席なら予約済みの席にあたります。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "num", title: "行に番号を振る" },
  { type: "intro", id: "apply", title: "番号を使って行をまたぐ" },
  { type: "intro", id: "seq", title: "シーケンスと採番" },
  {
    type: "q", sec: "第8章の導入", title: "SQLが連番を持たなかった理由", ref: "num",
    prompt: "SQLは伝統的に、連番のような順序を持った数を扱う機能を持っていなかった。本書が挙げる、関係モデルの理論上の理由はどれ？",
    choices: [
      { text: "業務的に意味のない連番はエンティティの属性とみなされず、テーブルの行には順序がないと定義されていたから", ok: true, note: "ループも行の順序を前提にした操作なので、SQLがループを排除した理由ともつながっています。" },
      { text: "連番を計算するとパフォーマンスが落ちるから", ok: false, note: "性能ではなく、理論上の要請です。" },
      { text: "当時のハードウェアでは、大きな数を扱えなかったから", ok: false, note: "本書の挙げる理由ではありません。" },
      { text: "連番はアプリケーションで振るものと標準SQLで決められていたから", ok: false, note: "そのような規定はありません。現在では、シーケンスオブジェクトやIDENTITY列、ウィンドウ関数が標準SQLに入っています。" },
    ],
    takeaway: "実務の要求に応えて、SQLには順序と連番を扱う機能が加わりました。<b>ウィンドウ関数によって、SQLは集合指向に手続き型を混ぜたハイブリッドな言語になった</b>、というのがこの章のテーマです。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "主キーの順に連番を振る", ref: "num", table: ["weights"], tableNote: WEIGHTS_NOTE,
    prompt: "Weightsの行に、student_idの順で1から重複のない連番を振りたい。正しい連番を返し、かつWeightsを1回しか読まないのはどれ？",
    choices: [
      { q: "num_rank", tag: "RANK() OVER (ORDER BY weight)", ok: false, note: "体重の順位です。55kgの2人が2位で並び、3位がありません。" },
      { q: "num_sub", tag: "相関サブクエリでCOUNT", ok: false, note: "ROW_NUMBERがなかった頃の書き方で、連番は正しく振れます。ただしPostgreSQLの計画では、SubPlanのSeq Scan on weights w2がloops=7で、W1とW2の2系統でWeightsを読んでいます。" },
      { q: "num_window", tag: "ROW_NUMBER", ok: true, note: "Seq Scan on weightsは1つで、student_idでSortしてからWindowAggで番号を振ります。" },
    ],
    takeaway: "<b>相関サブクエリによるナンバリングは、完全に過去のもの。</b>可読性でも性能でもROW_NUMBERが勝ります。MySQLも、ウィンドウ関数ならWeightsを1回読むだけです。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "相関サブクエリで連番が振れる理由", ref: "num", table: ["weights"], tableNote: WEIGHTS_NOTE,
    prompt: "相関サブクエリの解は、自分以下のstudent_idの行を数えて連番にしている。比較のキーをstudent_idからweightに変えると、どうなった？",
    choices: [
      { text: "同じ体重の行が同じ番号になり、2、5、6が抜けた", ok: true, note: "結果は1、3、3、4、7、7、7です。student_idは主キーなので、自分以下の行の集合が1行ずつ増えていきます。体重は重複するので、この性質が崩れます。" },
      { text: "student_idのときと同じ1〜7の連番になった", ok: false, note: "結果タブのとおり、同じ番号が並びます。" },
      { text: "エラーになった", ok: false, note: "構文は正しいので実行できます。番号の付き方が変わるだけです。" },
      { text: "体重の軽い順に1〜7の連番になった", ok: false, note: "同じ体重の人は、自分以下の行の数も同じなので、同じ番号になります。" },
    ],
    show: [{ q: "num_sub_weight", tag: "weightで比較" }, { q: "num_sub", tag: "student_idで比較" }],
    takeaway: "このサブクエリは、要素が1つずつ増える集合を作ってCOUNTで数えるトリックです。<b>比較のキーが一意だから、連番になる。</b>",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "主キーが複数列のとき", ref: "num", table: ["weights2"], tableNote: WEIGHTS2_NOTE,
    prompt: "Weights2に、classとstudent_idの順で1から連番を振る。相関サブクエリで書いたとき、正しい連番を返すのはどれ？",
    choices: [
      { q: "num2_sub_and", tag: "列ごとにANDで比較", ok: false, note: "classもstudent_idも自分以下の行を数えています。クラス2の100番は、クラス1の100番と自分しか数えられず2になります（結果タブ）。" },
      { q: "num2_sub", tag: "行式で比較", ok: true, note: "本書が示す解です。(class, student_id) <= (W1.class, W1.student_id)は、辞書式の順で比較します。classが小さい行はstudent_idに関係なく前になるので、1〜7の連番になります。" },
      { text: "相関サブクエリでは、2列のキーで連番を振れない", ok: false, note: "行式を使えば書けます。PostgreSQLもMySQLも行式の比較に対応しています。" },
    ],
    show: [{ q: "num2_sub_and", tag: "列ごとにANDで比較" }, { q: "num2_sub", tag: "行式で比較" }, { q: "num2_window", tag: "ROW_NUMBER" }], showDefault: 1,
    takeaway: "<b>ROW_NUMBERならORDER BYのキーに列を足すだけ</b>で、Weights2を読むのも1回です（実行計画タブのROW_NUMBER）。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "グループごとに連番を振る", ref: "num", table: ["weights2"], tableNote: WEIGHTS2_NOTE,
    prompt: "クラスごとに、student_idの順で1から番号を振り直したい。正しい番号を返し、かつWeights2を1回しか読まないのはどれ？",
    choices: [
      { q: "num2_window", tag: "PARTITION BYなし", ok: false, note: "全体で1〜7の連番になり、クラス2の先頭が4から始まります。" },
      { q: "part_sub", tag: "相関サブクエリ", ok: false, note: "同じクラスで自分以下のstudent_idを数えるので、番号は正しく振れます。ただしSubPlanがloops=7で、Weights2を何度も読んでいます。" },
      { q: "part_window", tag: "PARTITION BY class", ok: true, note: "classでパーティションカットしてから番号を振ります。クラスが変わると番号が1に戻ります。" },
    ],
    takeaway: "<b>PARTITION BYを足しても、ソートのキーが同じなら計画は変わらない。</b>PARTITION BYなしと同じSortとWindowAggで、番号を1に戻す区切りが加わるだけです。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "ナンバリングによる更新", ref: "num", table: ["weights3"],
    prompt: "Weights3のseq列に、クラスごとの連番を書き込みたい。正しく動くUPDATE文はどれ？",
    choices: [
      { q: "upd_direct", tag: "SET句にROW_NUMBERを直接書く", ok: false, note: "PostgreSQLは「window functions are not allowed in UPDATE」、MySQLも「You cannot use the window function」というエラーで止まります。" },
      { q: "upd_seq", tag: "サブクエリSeqTblを経由する", ok: true, note: "本書の解です。ROW_NUMBERで番号を振ったサブクエリSeqTblを作り、更新する行と主キーで突き合わせて番号を取り出します。PostgreSQLでもMySQLでも、クラス1が1〜3、クラス2が1〜4になりました。" },
      { text: "UPDATE文ではナンバリングできないので、一度SELECTしてからアプリケーションで更新する", ok: false, note: "サブクエリを経由すれば、1つのUPDATE文で書けます。" },
    ],
    takeaway: "<b>ROW_NUMBERで更新するには、サブクエリで迂回する。</b>ただしPostgreSQLの計画では、サブクエリのWindowAggがloops=7で、更新する行ごとに同じクラスの行を並べ直しています。大きなテーブルでは重くなります。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "自然数の連続性と一意性", ref: "apply", table: ["weights_even"], tableNote: EVEN_NOTE,
    prompt: "昇順と降順の番号が出会う行を中央値とする解で、ROW_NUMBERの代わりにRANKを使った。偶数個のWeightsEvenでhi IN (lo, lo + 1, lo − 1)を満たす行と、その平均はどうなる？",
    choices: [
      { text: "B343（60kg）の1行だけが残り、平均は60になる", ok: true, note: "結果タブのとおり、RANKでは55kgの2人が同じ2、72kgの3人が同じ5になり、6や7が飛びます。hiとloが出会うのは60kgの行だけで、正しい中央値の66は求まりません。" },
      { text: "60kgと72kgの2行が残り、平均は66になる", ok: false, note: "ROW_NUMBERを使った場合の結果です。RANKでは72kgの行のhiが5、loが2で、条件を満たしません。" },
      { text: "1行も残らず、NULLになる", ok: false, note: "60kgの行はhiが4、loが5で、hi = lo − 1を満たします。" },
      { text: "全員の平均の65.75になる", ok: false, note: "条件で行を絞っているので、全員の平均にはなりません。" },
    ],
    show: [{ q: "med_rank", tag: "RANKで番号を振る" }, { q: "med_even_rows", tag: "ROW_NUMBERで番号を振る" }],
    takeaway: "本書の言う自然数の性質は、<b>連続性（5の次が9のように飛ばない）と一意性（同じ数が二度現れない）</b>です。RANKやDENSE_RANKはどちらかが崩れるので、両端から1行ずつ歩く2人の速さが一定になりません。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "集合指向の中央値", ref: "apply", table: ["weights"],
    prompt: "集合指向の解は、WeightsをW1、W2として自己結合し、HAVING句に2つの条件を書く。この2つの条件は何を表している？",
    code: "HAVING SUM(CASE WHEN W2.weight >= W1.weight THEN 1 ELSE 0 END) >= COUNT(*) / 2\n   AND SUM(CASE WHEN W2.weight <= W1.weight THEN 1 ELSE 0 END) >= COUNT(*) / 2",
    choices: [
      { text: "W1.weight以上の値が半分以上あり、かつ以下の値も半分以上ある。つまり上位の集合と下位の集合の両方に属する", ok: true, note: "CASE式は、値がその集合に含まれれば1、含まれなければ0を返す特性関数です。両方の条件を満たす値が真ん中にあたり、偶数のときは2つ残るので、外側のAVGで平均します。" },
      { text: "W1.weightより大きい値と小さい値の数が、ちょうど等しい", ok: false, note: "条件は以上と以下で、しかも半分以上です。等しいかを比べているわけではありません。" },
      { text: "W1.weightが平均値より大きく、最大値より小さい", ok: false, note: "平均値は使っていません。" },
      { text: "重複した体重を取り除いている", ok: false, note: "重複を取り除くのはGROUP BY W1.weightのほうです。HAVINGは真ん中の値を選んでいます。" },
    ],
    show: [{ q: "med_set", tag: "奇数（Weights）" }, { q: "med_even_set", tag: "偶数（WeightsEven）" }],
    takeaway: "極めて「SQLらしい」解ですが、<b>コードが一目でわかりにくく、自己結合なのでWeightsを2回読む</b>のが欠点です。計画では7×7=49行の組をNested Loopで作っています。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "両端から歩いて出会う", ref: "apply", table: ["weights_even"], tableNote: EVEN_NOTE,
    prompt: "手続き型の解❶は、昇順の番号hiと降順の番号loが出会う行を選ぶ。偶数個のWeightsEvenでは、hi IN (lo, lo + 1, lo − 1)を満たす行は何行あった？",
    choices: [
      { text: "0行", ok: false, note: "偶数でも、真ん中の2行が条件を満たします。" },
      { text: "1行", ok: false, note: "1行だけになるのは、行数が奇数でhi = loの行があるときです。" },
      { text: "2行", ok: true, note: "B343（hi=4、lo=5）とB346（hi=5、lo=4）の2行です。それぞれhi = lo − 1、hi = lo + 1を満たし、平均の66が中央値になります。" },
      { text: "8行", ok: false, note: "WHERE句で真ん中の行だけに絞っています。" },
    ],
    show: [{ q: "med_even_rows", tag: "残った行" }, { q: "med_even", tag: "中央値（AVG）" }],
    takeaway: "奇数なら「hi = lo」の1行、偶数なら「hi = lo ± 1」の2行。<b>奇数と偶数の場合分けを、IN述語1つにまとめられる</b>のがこの解のうまいところです。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "中央値の3つの解", ref: "apply", table: ["weights"],
    prompt: "中央値を求めたい。正しい値（60）を返し、Weightsを1回だけ読み、ソートも1回で済むのはどれ？",
    choices: [
      { q: "med_avg", tag: "AVG", ok: false, note: "平均値の62.29です。中央値と違って、平均は外れ値の影響を受けます。" },
      { q: "med_set", tag: "集合指向（自己結合）", ok: false, note: "結果は60で正しく、ソートもしません。ただしWeightsを2回読み、49行の組を作ってから集約しています。" },
      { q: "med_rownum", tag: "手続き型❶（hiとlo）", ok: false, note: "結果は60で正しく、Weightsを読むのも1回です。ただし昇順と降順で2つの番号を振るので、Sortが2回あります。" },
      { q: "med_count", tag: "手続き型❷（2×番号−行数）", ok: true, note: "2×番号−行数が0〜2の行が中央にあたります。COUNT(*) OVER()にはORDER BYがないので、ROW_NUMBERと同じweightの昇順のソート1回で済みます。" },
    ],
    takeaway: "本書は手続き型❷を、ベンダー独自の関数を除けば<b>おそらくSQLで中央値を求める最速のクエリ</b>と評価しています。集合指向の解と比べると、結合を消せた代わりにソートを使う取引です。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "手続き型❷をMySQLで", ref: "apply", table: ["weights"], db: "my",
    prompt: "手続き型❷（2×ROW_NUMBER − COUNT(*) OVER()）を、MySQL 8.0でそのまま実行した。どうなった？",
    choices: [
      { text: "PostgreSQLと同じ60を返した", ok: false, note: "実行計画タブのとおり、エラーになりました。" },
      { text: "BIGINT UNSIGNEDの範囲外というエラーになった", ok: true, note: "MySQLのROW_NUMBERは符号なしの整数（BIGINT UNSIGNED）を返すので、そこから引いた結果も符号なしとして扱われます。番号1の行では2×1−7が負になり、範囲外のエラーで止まりました。" },
      { text: "MySQLにはCOUNT(*) OVER()がないので構文エラーになった", ok: false, note: "MySQL 8.0はウィンドウ関数に対応しています。エラーは計算の途中で起きています。" },
      { text: "平均値の62.29を返した", ok: false, note: "エラーで結果は返りませんでした。" },
    ],
    show: [{ q: "med_count", tag: "手続き型❷" }, { q: "med_rownum", tag: "手続き型❶" }],
    takeaway: "本書も注で、<b>MySQLではROW_NUMBERの結果をCAST(... AS SIGNED)で符号付きにする</b>よう述べています。そうすると60を返します。手続き型❶は引き算で負にならないので、MySQLでもそのまま動きます。",
  },
  {
    type: "q", sec: "演習問題8", title: "ソートキーからstudent_idを外すと", ref: "apply", table: ["weights_ex8"], tableNote: EX8_NOTE,
    prompt: "手続き型❶のORDER BYから、student_idを外した。本書の演習問題8のデータで実行すると、PostgreSQLの結果はどうなった？",
    code: "ROW_NUMBER() OVER (ORDER BY weight ASC)  AS hi,\nROW_NUMBER() OVER (ORDER BY weight DESC) AS lo",
    choices: [
      { text: "正しく65を返した", ok: false, note: "結果タブのとおり、正しい値は返りませんでした。" },
      { text: "NULLを返した（hiとloが出会う行がなかった）", ok: true, note: "同じ体重の行の並び順は保証されません。PostgreSQLでは、70kgのC563がhi=4、lo=2、A100がhi=5、lo=3になり、どの行もhi IN (lo, lo ± 1)を満たしませんでした。0行の平均はNULLです。MySQLも別の並びでNULLでした。" },
      { text: "エラーになった", ok: false, note: "構文は正しいので実行できます。" },
      { text: "全員の平均を返した", ok: false, note: "WHERE句で絞った行の平均です。" },
    ],
    show: [{ q: "ex8_noid", tag: "student_idなし" }, { q: "ex8_rows", tag: "hiとloの値" }, { q: "ex8_id", tag: "student_idあり" }],
    takeaway: "<b>weightだけで並べると、同じ体重の行がhiとloで同じ順序になる保証がない。</b>並び順は物理的な格納順序などで変わり、再現性のない計算になります。本書の環境では70kgの1行が残って70を返しました。主キーを加えて順序を一意にすれば、どの環境でも65です。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "欠番の区間を求める（集合指向）", ref: "apply", table: ["numbers"], tableNote: NUMBERS_NOTE,
    prompt: "集合指向の解は、自分より大きい数とNumbers同士を結合し、GROUP BY N1.numのあとHAVING (N1.num + 1) < MIN(N2.num)で絞る。PostgreSQLのNested Loopが作った組は何行？",
    choices: [
      { text: "7行", ok: false, note: "Numbersの行数です。結合で組み合わせが増えます。" },
      { text: "21行", ok: true, note: "7×7=49の組から、N2.num > N1.numを満たさない28組を捨てて（Rows Removed by Join Filter: 28）21行です。N1.numごとのMIN(N2.num)は直後の数で、それがN1.num + 1でなければ間に欠番があります。" },
      { text: "28行", ok: false, note: "捨てた行の数です。" },
      { text: "49行", ok: false, note: "条件を当てる前の組み合わせの数です。" },
    ],
    show: [{ q: "gap_set", tag: "集合指向（自己結合）" }, { q: "gap_window", tag: "手続き型（1行あと）" }],
    takeaway: "1の直後は3、4の直後は7、9の直後は12なので、2、5〜6、10〜11が欠番です。<b>集合指向の名答だが、自己結合が避けられない。</b>結合はコストが高く、実行計画の変動リスクも抱えます。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "「1行あと」との比較", ref: "apply", table: ["numbers"], tableNote: NUMBERS_NOTE,
    prompt: "手続き型の解は、MAX(num) OVER (ORDER BY num ROWS BETWEEN 1 FOLLOWING AND 1 FOLLOWING)で次の行の値を求め、その差（diff）が1でない行を欠番の手前とする。最後の行の12はどう扱われる？",
    choices: [
      { text: "次の行がないのでnext_numがNULLになり、diffもNULLなので、diff <> 1で除外される", ok: true, note: "結果タブのとおり、12のnext_numは空（NULL）です。NULLとの比較は真にならないので、WHERE diff <> 1を通りません。" },
      { text: "次の行がないのでエラーになる", ok: false, note: "フレームに行がなければ、MAXはNULLを返すだけです。" },
      { text: "先頭の1に戻って比較され、13〜0が欠番として出る", ok: false, note: "フレームは並び順の先頭に戻りません。" },
      { text: "自分自身の12と比べてdiffが0になり、欠番として出る", ok: false, note: "フレームは「1行あと」だけで、自分自身は含みません。" },
    ],
    show: [{ q: "gap_next", tag: "1行あとの値" }, { q: "gap_window", tag: "手続き型の解" }],
    takeaway: "<b>カレント行と1行あとの値を比べる、手続き型の王道をそのままSQLにしたもの。</b>Numbersを読むのは1回で、結合がないので計画も安定します。データが大きくなると、主キーのインデックスでソートを省く計画になることもあります。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "テーブルに存在するシーケンス", ref: "apply", table: ["numbers"], tableNote: NUMBERS_NOTE,
    prompt: "Numbersにある連続した区間（1、3〜4、7〜9、12）を求める。num − ROW_NUMBER() OVER (ORDER BY num)を計算し、その値でGROUP BYした。この値が同じになるのはどんな行？",
    choices: [
      { text: "連続した数が並んでいる行", ok: true, note: "連続している間は、numと番号が1ずつ一緒に増えるので差が変わりません。欠番を挟むとnumだけが飛ぶので、差が開きます。差は1が0、3と4が1、7〜9が3、12が5です。" },
      { text: "numが偶数どうし、奇数どうしの行", ok: false, note: "差は偶奇とは関係なく、それまでの欠番の数で決まります。" },
      { text: "番号が同じ行", ok: false, note: "ROW_NUMBERは行ごとに違う番号を振ります。" },
      { text: "どの行も同じ値になる", ok: false, note: "欠番がなければそうなりますが、Numbersには欠番があります。" },
    ],
    show: [{ q: "seq_window", tag: "手続き型（num − 番号）" }, { q: "seq_set", tag: "集合指向（自己結合）" }],
    takeaway: "<b>連続した区間は「値と歯抜けのない連番の差」でグループにできる。</b>空席のカタマリを探すような問題です。集合指向の解は自己結合で28行の組を作るのに対し、手続き型は1回のSortとWindowAggで済みます。",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "連番を払い出す機能への本書のスタンス", ref: "seq",
    prompt: "標準SQLには、連番を払い出す機能としてシーケンスオブジェクトとIDENTITY列がある。本書のスタンスはどれ？",
    choices: [
      { text: "どちらも極力使わない。使わなければならないなら、IDENTITY列よりシーケンスオブジェクトを使う", ok: true, note: "ORMの既定で主キーが連番になる場合など、どうしても使うときは必要な箇所だけにとどめます。" },
      { text: "主キーには必ずシーケンスオブジェクトの連番を使う", ok: false, note: "本書は連番の主キーが引き起こす性能問題を挙げ、極力使わないよう勧めています。" },
      { text: "IDENTITY列のほうが手軽なので、シーケンスオブジェクトより優先する", ok: false, note: "本書はIDENTITY列を、機能的にも性能的にもシーケンスオブジェクトの劣化版と評価しています。" },
      { text: "性能のために、採番テーブルを自作する", ok: false, note: "採番テーブルは、シーケンスのロックの仕組みをテーブルで再現したもので、CACHEのような改善手段もありません。" },
    ],
    takeaway: "シーケンスオブジェクトの問題は、構文が実装依存で移植性がないこと、現実のエンティティの属性でないこと、そして<b>実務家でも無視できない性能問題</b>です。",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "CACHEとNOORDERの代償", ref: "seq",
    prompt: "シーケンスオブジェクトは既定で一意性・連続性・順序性を満たそうとし、払い出しのたびに排他ロックをかける。CACHEとNOORDERで性能を上げても、守られ続ける性質はどれ？",
    choices: [
      { text: "一意性", ok: true, note: "重複値が出ては主キーに使えないので、一意性はシーケンスが最低限満たすべき性質です。" },
      { text: "連続性", ok: false, note: "CACHEを有効にすると、システム障害のときに欠番が出ます。" },
      { text: "順序性", ok: false, note: "NOORDERでは、後からアクセスしたほうに小さな番号が振られることがあります。時系列のデータには使えません。" },
      { text: "3つとも守られる", ok: false, note: "CACHEとNOORDERは、連続性と順序性を手放してロックのオーバーヘッドを減らすオプションです。" },
    ],
    takeaway: "機能の要件と照らし合わせて、欠番や順序の逆転を許せるならCACHEとNOORDERを使えます。<b>シーケンスオブジェクトのチューニング手段は、この程度しかない。</b>",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "連番キーのホットスポット", ref: "seq",
    prompt: "連番を主キーにしたテーブルに、多くのセッションが同時にINSERTする。B+treeインデックスで性能が落ちる理由はどれ？",
    choices: [
      { text: "キーの大小でページが分かれるので、常に「最大値＋1」が右端のページに追加され、そこにアクセスとロックが集中する", ok: true, note: "本書はこれをRight-Edge Insertionと呼びます。I/O負荷が集中する場所を、ホットスポットまたはホットブロックと言います。" },
      { text: "連番が最大値に達すると、それ以上INSERTできなくなる", ok: false, note: "問題は上限ではなく、同時に同じ場所へ書き込むことです。" },
      { text: "連番のインデックスは検索に使えないので、全件を読む", ok: false, note: "検索には使えます。問題は更新の集中です。" },
      { text: "シーケンスオブジェクトを使ったときにだけ起き、IDENTITY列なら起きない", ok: false, note: "連番や時刻のような連続した値なら、シーケンスを使わなくても起きます。IDENTITY列も同じ欠点を持ちます。" },
    ],
    takeaway: "分散データベース（NewSQL）でも、主キーの範囲でデータをシャードに分けると、<b>連番の主キーは特定のシャードにINSERTを集中させる。</b>そのためNewSQLでは、主キーにランダムな値が勧められます。",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "ホットスポットへの対策", ref: "seq",
    prompt: "ホットスポットを緩和する3つの対策のうち、本書が最もモダンで推奨するものと、その欠点の組み合わせはどれ？",
    choices: [
      { text: "UUID。16バイトで大きく、読みにくく、主流のバージョンは順序を持たないので範囲検索のキャッシュ効率が悪い", ok: true, note: "データベースで推奨されるのはランダムに生成するバージョン4です。時刻を使うバージョン7は順序を保てますが、まだ広く普及していません。" },
      { text: "逆キーインデックス。欠点はない", ok: false, note: "INSERTは速くなりますが、範囲検索でI/Oが増えてSELECTが遅くなるリスクがあり、実装依存でもあります。" },
      { text: "インデックスに冗長な列を加える。欠点はない", ok: false, note: "論理的に不要な列をキーに加えるので、まっとうなモデル設計とは言えません。" },
      { text: "シーケンスにCACHEを指定する。欠点は欠番が出ること", ok: false, note: "CACHEはシーケンス自体のロックを減らす対策で、インデックスの右端に書き込みが集中する問題は解決しません。" },
    ],
    takeaway: "3つの対策は、逆キーインデックスのように内部で値を分散させるしくみ、インデックスへの冗長な列の追加、<b>UUIDのようなランダムで一意な識別子</b>です。UUIDにも欠点があり、ここでも利点と欠点を比べるトレードオフになります。",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "IDENTITY列と採番テーブル", ref: "seq",
    prompt: "IDENTITY列と採番テーブルについて、本書の評価として正しいのはどれ？",
    choices: [
      { text: "IDENTITY列はシーケンスの劣化版で、出番はシーケンスオブジェクトのないMySQLくらい。採番テーブルは今から使うメリットがない", ok: true, note: "IDENTITY列は特定のテーブルに結び付き、CACHEやNOORDERも基本的に指定できません（OracleのIDENTITY列は例外です）。採番テーブルはシーケンスのロックをテーブルで再現したもので、改善手段もありません。" },
      { text: "IDENTITY列はテーブルごとに独立しているので、シーケンスよりロックが少なく速い", ok: false, note: "本書は、IDENTITY列を機能的にも性能的にもシーケンスの劣化版と評価しています。" },
      { text: "採番テーブルは単純なSQLで動くので、チューニングしやすい", ok: false, note: "SQLが単純すぎて、ボトルネックになってもチューニングの余地はまずありません。" },
      { text: "どちらもホットスポットは起きない", ok: false, note: "連番を主キーにすれば、IDENTITY列でもホットスポットは起きます。" },
    ],
    takeaway: "<b>連番の払い出しは、並列化が難しい単一のボトルネックになりやすい。</b>アプリケーション側で採番しても、排他制御が要るなら同じことが起きます。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  num: () => `<div class="grid">
      <div class="col">
        <p class="prompt">関係モデルでは、テーブルの行に順序はなく、業務的に意味のない連番は属性とみなされませんでした。今は、ウィンドウ関数で問い合わせの中で番号を振れます。</p>
        <div class="label">番号を振るウィンドウ関数（Weightsの体重で並べた例）</div>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>weight</th><th>ROW_NUMBER</th><th>RANK</th><th>DENSE_RANK</th></tr></thead>
          <tbody>
            <tr><td class="num">50</td><td class="num">1</td><td class="num">1</td><td class="num">1</td></tr>
            <tr><td class="num">55</td><td class="num">2</td><td class="num">2</td><td class="num">2</td></tr>
            <tr><td class="num">55</td><td class="num">3</td><td class="num">2</td><td class="num">2</td></tr>
            <tr><td class="num">60</td><td class="num">4</td><td class="num">4</td><td class="num">3</td></tr>
          </tbody></table></div>
        <ul class="points">
          <li>ROW_NUMBERは同じ値でも別の番号を振り、重複のない連番になります。</li>
          <li>RANKとDENSE_RANKは同じ値に同じ順位を付けます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">ナンバリングの4つの場面</div>
        ${pre("-- 主キーが1列\nROW_NUMBER() OVER (ORDER BY student_id)\n\n-- 主キーが複数列\nROW_NUMBER() OVER (ORDER BY class, student_id)\n\n-- グループごと\nROW_NUMBER() OVER (PARTITION BY class\n                       ORDER BY student_id)\n\n-- 更新：SET句ではサブクエリを経由する\nUPDATE Weights3\n   SET seq = (SELECT seq FROM (... ROW_NUMBER() ...) SeqTbl\n               WHERE 主キーが一致)")}
        <ul class="points">
          <li>昔は、自分以下の主キーの行を相関サブクエリで数えて連番を作りました。テーブルを何度も読むので、今は使う理由がありません。</li>
        </ul>
      </div>
    </div>`,
  apply: () => {
    const r = analyze(D.seq_window.pg, "pg");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">連番には、飛ばない（連続性）、重複しない（一意性）という自然数の性質があります。番号を振れば、行をまたぐ比較を1行の中の計算に変えられます。</p>
        <ul class="points">
          <li><b>中央値</b>：両端から1行ずつ数えて出会う行を選びます。偶数のときは真ん中の2行の平均です。</li>
          <li><b>欠番（断絶区間）</b>：1行あとの値と比べて、差が1でない行を探します。</li>
          <li><b>存在するシーケンス</b>：値から連番を引くと、連続している間は同じ値になります。</li>
        </ul>
        <div class="label">集合指向と手続き型</div>
        <ul class="points">
          <li>集合指向の解は自己結合で行の組を作り、集合の境界を求めます。行数の2乗に近い組を作り、結合のリスクも抱えます。</li>
          <li>手続き型の解はテーブルを1回読み、ソートしてから番号を振ります。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">例：テーブルに存在するシーケンス（8.2の問題）</div>
        ${pre(D.seq_window.sql)}
        <div class="label">PostgreSQLの実行計画</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>Seq Scan on numbersで7行を1回読み、numでSortします。</li>
          <li>WindowAggが番号を振ります。</li>
          <li>HashAggregateがnum − 番号の値ごとに4つのグループにまとめ、最後にlowの順に並べます。</li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
  seq: () => `<div class="grid">
      <div class="col">
        <div class="label">連番を払い出す3つの手段</div>
        <ul class="points">
          <li><b>シーケンスオブジェクト</b>：スキーマ内の独立したオブジェクトで、CREATE SEQUENCEで作ります。MySQLにはありません。</li>
          <li><b>IDENTITY列</b>：特定のテーブルの列に、INSERTのたびに連番を入れます。シーケンスの劣化版です。</li>
          <li><b>採番テーブル</b>：連番を払い出すための専用のテーブルです。シーケンスがなかった頃の名残です。</li>
        </ul>
        <p class="takeaway"><b>どちらの機能も極力使わない。使うならIDENTITY列よりシーケンスオブジェクト。</b></p>
      </div>
      <div class="col">
        <div class="label">シーケンスそのものの性能問題</div>
        <ul class="points">
          <li>一意性・連続性・順序性を守るため、払い出しのたびに排他ロックをかけます。</li>
          <li>CACHEは連続性を、NOORDERは順序性を手放して、オーバーヘッドを減らします。</li>
        </ul>
        <div class="label">連番をキーに使う性能問題</div>
        <ul class="points">
          <li>B+treeインデックスの右端のページにINSERTが集中します（Right-Edge Insertion、ホットスポット）。</li>
          <li>NewSQLでは、主キーの範囲で分けたシャードの1つにINSERTが集中します。</li>
          <li>対策は、逆キーインデックス、冗長な列の追加、UUIDの3つで、本書はUUIDを勧めます。</li>
        </ul>
      </div>
    </div>`,
};

const CH = {
  no: 8,
  store: "sql-jissen-ch8-drill-v1",
  h1: "SQLにおける順序<br>甦る手続き型",
  lede: () => `ウィンドウ関数による行のナンバリングと、その応用、連番を払い出す機能の性能問題を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画と結果が表示されます。自己結合で組を作るか、1回のソートで番号を振るかを比べてください。`,
  points: [
    "一度はSQLが追放した手続き型が、ウィンドウ関数という形で大々的に復活を遂げた。",
    "ウィンドウ関数は、コードを簡潔に書けるので可読性を上げる。",
    "ウィンドウ関数は、結合やテーブルへのアクセスを減らすことでパフォーマンスの向上にも貢献する。",
    "ウィンドウ関数で払い出せる連番は、SQLプログラミングの大きな武器になる。",
    "シーケンスオブジェクトやIDENTITY列はINSERT時の性能問題の原因になるので、使うときは注意する。",
    "ランダムな値を払い出すだけでよければ、UUIDが有力な選択肢になる。",
  ],
};
