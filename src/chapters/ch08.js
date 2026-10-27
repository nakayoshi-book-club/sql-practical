const T = {
  weights: { name: "Weights（体重）", cols: ["student_id", "weight"], rows: [
    ["A100",50],["A101",55],["A124",55],["B343",60],["B346",72],["C563",72],["C345",72]] },
  weights2: { name: "Weights2（クラスごとの体重）", cols: ["class", "student_id", "weight"], rows: [
    [1,"100",50],[1,"101",55],[1,"102",56],[2,"100",60],[2,"101",72],[2,"102",73],[2,"103",73]] },
  weights3: { name: "Weights3（連番の列を持つ）", cols: ["class", "student_id", "weight", "seq"], rows: [
    [1,"100",50,null],[1,"101",55,null],[1,"102",56,null],[2,"100",60,null],[2,"101",72,null],[2,"102",73,null],[2,"103",73,null]] },
  numbers: { name: "Numbers（数列）", cols: ["num"], rows: [[1],[3],[4],[7],[8],[9],[12]] },
};

const WEIGHTS_NOTE = "主キーはstudent_idです。行はこの順に格納されています。";
const WEIGHTS2_NOTE = "主キーは(class, student_id)の2列です。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "num", title: "行に番号を振る" },
  { type: "intro", id: "apply", title: "番号を使って行をまたぐ" },
  { type: "intro", id: "seq", title: "シーケンスと採番" },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "主キーの順に連番を振る", ref: "num", table: ["weights"], tableNote: WEIGHTS_NOTE,
    prompt: "Weightsの行に、student_idの順で1から重複のない連番を振りたい。正しい連番を返し、かつWeightsを1回しか読まないのはどれ？",
    choices: [
      { q: "num_rank", tag: "RANK() OVER (ORDER BY weight)", ok: false, note: "体重の順位です。55kgの2人が2位で並び、3位がありません。順位は連番ではありません。" },
      { q: "num_sub", tag: "相関サブクエリでCOUNT", ok: false, note: "自分以下のstudent_idを数えるので、連番は正しく振れます。ただしPostgreSQLの計画では、SubPlanのSeq Scan on weights w2がloops=7で、外側と合わせてWeightsを8回読んでいます。" },
      { q: "num_window", tag: "ROW_NUMBER", ok: true, note: "Seq Scan on weightsは1つで、student_idでSortしてからWindowAggで番号を振ります。" },
    ],
    takeaway: "<b>連番はROW_NUMBER、順位はRANKかDENSE_RANK。</b>相関サブクエリによるナンバリングは、ウィンドウ関数がなかった時代の書き方で、自己結合と同じようにテーブルを何度も読みます。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "主キーが2列のとき", ref: "num", table: ["weights2"], tableNote: WEIGHTS2_NOTE,
    prompt: "Weights2に、classとstudent_idの順で1から連番を振る。相関サブクエリで書いたとき、正しい連番を返すのはどれ？",
    choices: [
      { q: "num2_sub_and", tag: "列ごとにANDで比較", ok: false, note: "classもstudent_idも自分以下の行を数えています。クラス2の100番は、クラス1の100番と自分しか数えられず2になります（結果タブ）。" },
      { q: "num2_sub", tag: "行値式で比較", ok: true, note: "(class, student_id) <= (W1.class, W1.student_id)は、辞書式の順で比較します。classが小さい行はstudent_idに関係なく前になるので、1〜7の連番になります。" },
      { text: "相関サブクエリでは、2列のキーで連番を振れない", ok: false, note: "行値式を使えば書けます。PostgreSQLもMySQLも行値式の比較に対応しています。" },
    ],
    show: [{ q: "num2_sub_and", tag: "列ごとにANDで比較" }, { q: "num2_sub", tag: "行値式で比較" }, { q: "num2_window", tag: "ROW_NUMBER" }], showDefault: 1,
    takeaway: "相関サブクエリでは、複数列の順序を条件で表すのに工夫が要ります。<b>ROW_NUMBERならORDER BY class, student_idと書くだけ</b>で、Weights2を読むのも1回です（実行計画タブのROW_NUMBER）。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "クラスごとに番号を振り直す", ref: "num", table: ["weights2"], tableNote: WEIGHTS2_NOTE,
    prompt: "クラスごとに、student_idの順で1から番号を振り直したい。正しい番号を返し、かつWeights2を1回しか読まないのはどれ？",
    choices: [
      { q: "num2_window", tag: "PARTITION BYなし", ok: false, note: "全体で1〜7の連番になり、クラス2の先頭が4から始まります。" },
      { q: "part_sub", tag: "相関サブクエリ", ok: false, note: "同じクラスで自分以下のstudent_idを数えるので、番号は正しく振れます。ただしSubPlanがloops=7で、Weights2を8回読んでいます。" },
      { q: "part_window", tag: "PARTITION BY class", ok: true, note: "PARTITION BY classでクラスごとに区切ってから番号を振ります。計画はPARTITION BYなしと同じSortとWindowAggで、並べ替えのキーもclass, student_idのままです。" },
    ],
    takeaway: "<b>PARTITION BYを足しても、ソートのキーが同じなら計画は変わらない。</b>番号を1に戻す区切りがWindowAggに加わるだけです。",
  },
  {
    type: "q", sec: "8.1 行に対するナンバリング", title: "連番を列に書き込む", ref: "num", table: ["weights3"],
    prompt: "Weights3のseq列に、クラスごとの連番を書き込みたい。SET句のスカラサブクエリでROW_NUMBERを使うUPDATE文を、PostgreSQLで実行した。サブクエリの中のWindowAggは何回実行された？",
    choices: [
      { text: "1回", ok: false, note: "サブクエリは、更新する行のclassとstudent_idに相関しています。1回では済みません。" },
      { text: "2回（クラスの数）", ok: false, note: "PostgreSQLは同じクラスの結果を使い回しませんでした。" },
      { text: "7回（更新する行の数）", ok: true, note: "WindowAggにloops=7とあります。PostgreSQLはclassの条件をサブクエリの中に押し込み（Filter: (weights3.class = class)）、更新する行ごとに同じクラスの3〜4行だけを並べて番号を振っています。" },
      { text: "49回", ok: false, note: "サブクエリは更新する行ごとに1回です。" },
    ],
    show: [{ q: "upd_seq", tag: "UPDATE" }],
    takeaway: "<b>ROW_NUMBERの結果はUPDATE文でも使える。</b>ただし行ごとにサブクエリを実行するので、大きなテーブルでは重くなります。MySQL 8.0でもエラーにならず、同じ結果になりました（MySQLのEXPLAIN ANALYZEはこのUPDATE文の計画を表示しません）。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "中央値を求める", ref: "apply", table: ["weights"],
    prompt: "体重の中央値を求めたい。正しい値（60）を返し、Weightsを1回だけ読み、ソートも1回で済むのはどれ？",
    choices: [
      { q: "med_avg", tag: "AVG", ok: false, note: "平均値の62.29です。72kgが3人いるので、平均は中央値より大きくなります。" },
      { q: "med_set", tag: "自己結合とHAVING", ok: false, note: "結果は60で正しく、ソートもしません。ただしWeightsを2回読み、7×7=49行の組み合わせを作ってから集約しています。" },
      { q: "med_rownum", tag: "昇順と降順のROW_NUMBER", ok: false, note: "結果は60で正しく、Weightsを読むのも1回です。ただし昇順と降順で2つの番号を振るので、Sortが2回あります。" },
      { q: "med_count", tag: "ROW_NUMBERとCOUNT(*) OVER", ok: true, note: "2×番号−行数が0〜2の行が中央にあたります。行数が奇数なら1行、偶数なら2行が残り、その平均が中央値です。COUNT(*) OVER()は並べ替えが要らないので、Sortは1回です。" },
    ],
    takeaway: "<b>中央値は「上から数えても下から数えても真ん中の行」で、行の順序を使う手続き型の考え方が効く。</b>集合指向の解は自己結合で行数の2乗の組を作るので、大きなテーブルでは重くなります。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "中央値の解をMySQLで", ref: "apply", table: ["weights"], db: "my",
    prompt: "前の問題の正解（2×ROW_NUMBER − COUNT(*) OVER()）を、MySQL 8.0で実行した。どうなった？",
    choices: [
      { text: "PostgreSQLと同じ60を返した", ok: false, note: "実行計画タブのとおり、エラーになりました。" },
      { text: "BIGINT UNSIGNEDの範囲外というエラーになった", ok: true, note: "MySQLのROW_NUMBERは符号なしの整数（BIGINT UNSIGNED）を返すので、そこから引いた結果も符号なしとして扱われます。番号1の行では2×1−7が負になり、範囲外のエラーで止まりました。CAST(ROW_NUMBER() OVER (...) AS SIGNED)で符号付きにすると、60を返します。" },
      { text: "MySQLにはCOUNT(*) OVER()がないので構文エラーになった", ok: false, note: "MySQL 8.0はウィンドウ関数に対応しています。エラーは計算の途中で起きています。" },
      { text: "平均値の62.29を返した", ok: false, note: "エラーで結果は返りませんでした。" },
    ],
    show: [{ q: "med_count", tag: "ROW_NUMBERとCOUNT(*) OVER" }, { q: "med_rownum", tag: "昇順と降順のROW_NUMBER" }],
    takeaway: "<b>番号の引き算は、負になると型の違いで結果が変わる。</b>昇順と降順のROW_NUMBERを使う解は引き算をしないので、MySQLでも60を返します。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "同じ体重の人の並べ方", ref: "apply", table: ["weights"],
    prompt: "昇順と降順のROW_NUMBERで中央値を求める解では、ORDER BYに体重だけでなくstudent_idも書いている。その理由はどれ？",
    code: "ROW_NUMBER() OVER (ORDER BY weight ASC,  student_id ASC)  AS hi,\nROW_NUMBER() OVER (ORDER BY weight DESC, student_id DESC) AS lo",
    choices: [
      { text: "同じ体重の行の順番を、昇順と降順でちょうど逆にそろえるため", ok: true, note: "体重だけで並べると、同じ体重の行どうしの順番は決まりません。2つの番号で並びが逆にならないと、hiとloが真ん中で出会わず、中央値の行が選ばれないことがあります。" },
      { text: "student_idは主キーなので、書かないとエラーになるため", ok: false, note: "ORDER BYに主キーを書く義務はありません。体重だけでも実行はできます。" },
      { text: "体重が同じ行を1行にまとめるため", ok: false, note: "ROW_NUMBERは行をまとめません。同じ体重でも別の番号を振ります。" },
      { text: "ソートの回数を1回に減らすため", ok: false, note: "昇順と降順のソートが1回ずつ、合計2回のままです。" },
    ],
    show: [{ q: "med_rownum", tag: "昇順と降順のROW_NUMBER" }],
    takeaway: "<b>ROW_NUMBERで順番に意味を持たせるなら、ORDER BYで順番が一意に決まるようにする。</b>RANKを使うと、同じ体重の行に同じ番号が付き、真ん中がずれることがあります。",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "欠番の区間を求める", ref: "apply", table: ["numbers"],
    prompt: "Numbersの欠番（2、5〜6、10〜11）を求める。集合指向の解は、自分より大きい数とNumbers同士を結合する。PostgreSQLのNested Loopが作った組は何行？",
    choices: [
      { text: "7行", ok: false, note: "Numbersの行数です。結合で組み合わせが増えます。" },
      { text: "21行", ok: true, note: "7×7=49の組から、N2.num > N1.numを満たさない28組を捨てて（Rows Removed by Join Filter: 28）21行です。その後HashAggregateで数ごとに次の数を求め、隣と離れている3行を残します。" },
      { text: "28行", ok: false, note: "捨てた行の数です。" },
      { text: "49行", ok: false, note: "条件を当てる前の組み合わせの数です。" },
    ],
    show: [{ q: "gap_set", tag: "集合指向（自己結合）" }, { q: "gap_window", tag: "手続き型（次の行を見る）" }],
    takeaway: "手続き型の解は、MAX(num) OVER (ORDER BY num ROWS BETWEEN 1 FOLLOWING AND 1 FOLLOWING)で<b>次の行の値を1行の中に持ってくる</b>ので、Numbersを読むのは1回です。<b>集合指向の非等値の自己結合は、行数の2乗に近い組を作る。</b>",
  },
  {
    type: "q", sec: "8.2 行に対するナンバリングの応用", title: "連続する区間を求める", ref: "apply", table: ["numbers"],
    prompt: "Numbersに存在する連続した区間（1、3〜4、7〜9、12）を求める。num − ROW_NUMBER() OVER (ORDER BY num)を計算し、その値でGROUP BYした。この値が同じになるのはどんな行？",
    choices: [
      { text: "連続した数が並んでいる行", ok: true, note: "連続している間は、numと番号が1ずつ一緒に増えるので差が変わりません。欠番を挟むとnumだけが飛ぶので、差が変わります。差は1が0、3と4が1、7〜9が3、12が5です。" },
      { text: "numが偶数どうし、奇数どうしの行", ok: false, note: "差は偶奇とは関係なく、欠番の数で決まります。" },
      { text: "番号が同じ行", ok: false, note: "ROW_NUMBERは行ごとに違う番号を振ります。" },
      { text: "どの行も同じ値になる", ok: false, note: "欠番がなければそうなりますが、Numbersには欠番があります。" },
    ],
    show: [{ q: "seq_window", tag: "手続き型（num − 番号）" }, { q: "seq_set", tag: "集合指向（自己結合）" }],
    takeaway: "<b>連続した区間は「値と番号の差」でグループにできる。</b>集合指向の解は、自分以下の数を自己結合で数えて同じ差を作ります（実行計画タブ）。どちらも結果は同じですが、Nested Loopで28行の組を作るか、1回のSortとWindowAggで済むかの違いがあります。",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "シーケンスを速くする代償", ref: "seq",
    prompt: "シーケンスオブジェクトは一意性・連番性・順序性を保証するために、採番のたびにロックをかける。CACHEやNOORDERのオプションで性能を上げても、守られ続ける性質はどれ？",
    choices: [
      { text: "一意性", ok: true, note: "同じ値は二度と払い出されません。主キーに使えるのはこの性質があるからです。" },
      { text: "連番性", ok: false, note: "CACHEで払い出し済みの値は、DBMSが異常終了すると失われ、欠番になります。" },
      { text: "順序性", ok: false, note: "NOORDERを指定すると、払い出された値の大小と取得した順番が一致するとは限らなくなります。" },
      { text: "3つとも守られる", ok: false, note: "CACHEとNOORDERは、連番性と順序性を犠牲にして速くするオプションです。" },
    ],
    takeaway: "<b>シーケンスで必ず守られるのは一意性だけ。</b>欠番や順番の入れ替わりを許せるなら、CACHEとNOORDERで性能を上げられます。",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "連番キーのホットスポット", ref: "seq",
    prompt: "シーケンスで振った連番を主キーにしたテーブルに、大量のINSERTが集中している。本書が指摘する問題はどれ？",
    choices: [
      { text: "値が少しずつ増えるので、インデックスの同じブロックに書き込みが集中する", ok: true, note: "B-treeでは近い値が同じブロックに入るので、連番は常に右端のブロックに追加されます。物理的に同じ場所へのアクセスが集中し、ロックの競合が起きます（ホットスポット）。" },
      { text: "連番が上限に達すると、それ以上INSERTできなくなる", ok: false, note: "型の上限はありますが、本書が問題にしているのは同時実行時の競合です。" },
      { text: "連番の順にしかSELECTできなくなる", ok: false, note: "キーの値は検索の順序を制限しません。" },
      { text: "インデックスが使われなくなる", ok: false, note: "インデックスは使えます。問題は更新の集中です。" },
    ],
    takeaway: "対策には、Oracleの逆キーインデックスのように値を散らす方法がありますが、検索の性能を落とすことがあります。<b>連番は便利だが、物理的な配置の偏りという代償がある。</b>",
  },
  {
    type: "q", sec: "8.3 シーケンスオブジェクト・IDENTITY列・採番テーブル", title: "採番の手段を選ぶ", ref: "seq",
    prompt: "テーブルのキーに連番が必要になった。本書の考え方に最も近いのはどれ？",
    choices: [
      { text: "採番テーブルを作り、値を1つずつ増やして使う", ok: false, note: "採番テーブルはシーケンスがなかった時代の名残です。採番のたびにテーブルをロックするので、シーケンスと同じ問題がより重く出ます。" },
      { text: "IDENTITY列を使う", ok: false, note: "IDENTITY列はテーブルに縛られ、CACHEやNOORDERの調整もしにくいので、シーケンスより劣ると本書は評価しています。" },
      { text: "なるべく使わず、使うならシーケンスオブジェクトを選ぶ", ok: true, note: "本書は、連番のキーは使わずに済むなら使わない、使うならシーケンスオブジェクトを使うという順で勧めています。" },
      { text: "ROW_NUMBERで振った番号を、そのまま主キーとして保存する", ok: false, note: "ROW_NUMBERは問い合わせのたびに振り直される番号です。行の追加や削除で変わるので、行を識別するキーには使えません。" },
    ],
    takeaway: "<b>順序が必要になったら、まずROW_NUMBERで問い合わせの中で番号を振る。</b>テーブルにキーとして番号を持たせるのは最後の手段で、そのときはシーケンスオブジェクトを使います。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  num: () => `<div class="grid">
      <div class="col">
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
          <li>RANKとDENSE_RANKは同じ値に同じ順位を付けます。RANKは次の順位を飛ばし、DENSE_RANKは飛ばしません。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">2つの書き方</div>
        ${pre("-- ウィンドウ関数\nSELECT student_id,\n       ROW_NUMBER() OVER (ORDER BY student_id)\n  FROM Weights;\n\n-- 相関サブクエリ（自分以下の行を数える）\nSELECT student_id,\n       (SELECT COUNT(*) FROM Weights W2\n         WHERE W2.student_id <= W1.student_id)\n  FROM Weights W1;")}
        <ul class="points">
          <li>相関サブクエリは外側の行ごとにテーブルを読み直します。ウィンドウ関数ならテーブルを読むのは1回で、ソートを1回します。</li>
          <li>PARTITION BYを付けると、区切りごとに番号を1から振り直します。</li>
        </ul>
        <p class="takeaway"><b>SQLのテーブルの行には順序がない。</b>順序が必要なときは、ウィンドウ関数のORDER BYで問い合わせの中で順序を作ります。</p>
      </div>
    </div>`,
  apply: () => {
    const r = analyze(D.seq_window.pg, "pg");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">本書の第8章は、行の順序を使う「手続き型」の考え方をSQLに取り戻します。番号を振れば、行をまたぐ比較を1行の中の計算に変えられます。</p>
        <ul class="points">
          <li><b>中央値</b>：上から数えた番号と下から数えた番号が真ん中で出会う行を選びます。</li>
          <li><b>欠番</b>：次の行の値を1行の中に持ってきて、差が1でない行を探します。</li>
          <li><b>連続する区間</b>：値から番号を引くと、連続している間は同じ値になります。</li>
        </ul>
        <div class="label">集合指向と手続き型</div>
        <ul class="points">
          <li>集合指向の解は自己結合で行の組を作り、条件に合う組を数えます。ウィンドウ関数がなくても書けますが、行数の2乗に近い組を作ります。</li>
          <li>手続き型の解はテーブルを1回読み、ソートしてから番号を振ります。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">例：連続する区間（8.2の問題）</div>
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
          <li><b>シーケンスオブジェクト</b>：テーブルとは独立した、連番を払い出すオブジェクトです。一意性・連番性・順序性を保証します。</li>
          <li><b>IDENTITY列</b>：テーブルの列に連番を自動で入れます。テーブルに縛られ、調整の余地も少ないので、シーケンスより劣ります。</li>
          <li><b>採番テーブル</b>：番号を保存したテーブルを、アプリケーションが1つずつ増やして使います。シーケンスがなかった時代の名残です。</li>
        </ul>
        <p class="takeaway"><b>連番のキーはなるべく使わない。使うならシーケンスオブジェクト。</b></p>
      </div>
      <div class="col">
        <div class="label">シーケンスの性能問題</div>
        <ul class="points">
          <li>3つの性質を守るため、採番のたびに排他ロックをかけます。同時に多くのセッションが採番すると、ロック待ちが起きます。</li>
          <li>CACHEは値をまとめてメモリに取っておき、ロックの回数を減らします。代わりに異常終了で欠番が出ます。</li>
          <li>NOORDERは順序性を保証しない代わりに、ロックを減らします。</li>
        </ul>
        <div class="label">ホットスポット</div>
        <ul class="points">
          <li>連番をキーにすると、B-treeインデックスの右端のブロックに書き込みが集中します。物理的に同じ場所へのアクセスが重なり、競合が起きます。</li>
        </ul>
      </div>
    </div>`,
};

const CH = {
  no: 8,
  store: "sql-jissen-ch8-drill-v1",
  h1: "SQLにおける順序<br>甦る手続き型",
  lede: () => `ウィンドウ関数による行のナンバリングと、その応用を${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画と結果が表示されます。自己結合で組を作るか、1回のソートで番号を振るかを比べてください。`,
  points: [
    "テーブルの行に順序はない。順序が必要なときは、ウィンドウ関数で問い合わせの中で番号を振る。",
    "ROW_NUMBERは、相関サブクエリや自己結合によるナンバリングより、テーブルを読む回数が少ない。",
    "番号を振れば、中央値や欠番、連続する区間のような行をまたぐ問題を、手続き型の考え方で解ける。",
    "集合指向の自己結合は、行数の2乗に近い組を作るので、大きなテーブルでは重い。",
    "シーケンスやIDENTITY列はロックとホットスポットの問題を抱える。連番のキーはなるべく使わず、使うならシーケンスオブジェクト。",
  ],
};
