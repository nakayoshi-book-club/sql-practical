const T = {
  nonagg: { name: "NonAggTbl（非集約テーブル）", cols: ["id", "data_type", "data_1", "data_2", "data_3", "data_4", "data_5", "data_6"], rows: [
    ["Jim","A",100,10,34,346,54,null],["Jim","B",45,2,167,77,90,157],["Jim","C",null,3,687,1355,324,457],
    ["Ken","A",78,5,724,457,null,1],["Ken","B",123,12,178,346,85,235],["Ken","C",45,null,23,46,687,33],
    ["Beth","A",75,0,190,25,356,null],["Beth","B",435,0,183,null,4,325],["Beth","C",96,128,null,0,0,12]] },
  hotel: { name: "HotelRooms（ホテルの部屋）", cols: ["room_nbr", "start_date", "end_date"], rows: [
    [101,"2008-02-01","2008-02-06"],[101,"2008-02-06","2008-02-08"],[101,"2008-02-10","2008-02-13"],
    [202,"2008-02-05","2008-02-08"],[202,"2008-02-08","2008-02-11"],[202,"2008-02-11","2008-02-12"],
    [303,"2008-02-03","2008-02-17"]] },
  persons: { name: "Persons（人物）", cols: ["name", "age", "height", "weight"], rows: [
    ["Anderson",30,188,90],["Adela",21,167,55],["Bates",87,158,48],["Becky",54,187,70],["Bill",39,177,120],
    ["Chris",90,175,48],["Darwin",12,160,55],["Dawson",25,182,90],["Donald",30,176,53]] },
};

const NONAGG_NOTE = "data_typeがAの行ではdata_1とdata_2、Bの行ではdata_3〜data_5、Cの行ではdata_6だけを使います。";
const PERSONS_NOTE = "heightの単位はcm、weightの単位はkgです。";

const SLIDES = [
  { type: "cover" },
  { type: "intro", id: "plan", title: "集約の実行計画" },
  { type: "intro", id: "agg", title: "GROUP BYは集約とカット" },
  { type: "intro", id: "cut", title: "パーティションとウィンドウ関数" },
  {
    type: "q", sec: "4.1 集約", title: "1人の情報を1行にまとめる", ref: "agg", table: ["nonagg"], tableNote: NONAGG_NOTE,
    prompt: "NonAggTblでは1人の情報が3行に分かれている。data_typeごとに使う列だけを取り出して、1人1行にまとめたい。正しい結果を返すのはどれ？",
    choices: [
      { q: "agg_max_nocase", tag: "MAX（CASE式なし）", ok: false, note: "エラーにはなりませんが、data_typeを区別せずに3行の最大値を取ります。結果タブのJimのdata_3は、Bの行の167ではなくCの行の687です。" },
      { q: "agg_case_max", tag: "MAX(CASE ...)", ok: true, note: "CASE式で使わない種別の値をNULLにし、MAXでNULLを除いて1つの値を取り出します。結果はJimが100、10、167、77、90、457です。" },
      { text: "MAXを付けず、CASE式だけをSELECT句に書く", ok: false, note: "エラーです。GROUP BYで集約した後のSELECT句には、定数、集約キー、集約関数しか書けません。data_1〜data_6はどれでもありません。" },
    ],
    takeaway: "<b>GROUP BYは複数の行を1行にまとめる。</b>まとめた後の値は、集約関数で取り出します。MAXの代わりにMINやSUMでも、値が1つだけなら同じ結果になります。",
  },
  {
    type: "q", sec: "4.1 集約", title: "稼働日数が10日以上の部屋", ref: "agg", table: ["hotel"],
    prompt: "稼働日数（宿泊した泊数の合計）が10日以上の部屋を選びたい。到着日が2月1日、出発日が2月6日なら5泊で5日と数える。正しい結果を返すのはどれ？",
    choices: [
      { q: "hotel_having", tag: "HAVING", ok: true, note: "集約した後の合計をHAVING句で絞ります。101が10日、303が14日です。実行計画では、HashAggregateのFilterとして現れます。" },
      { text: "WHERE SUM(end_date - start_date) >= 10 と書く", ok: false, note: "エラーです。WHERE句は集約より前に評価されるので、集約関数を書けません。" },
      { q: "hotel_plus1", tag: "+1して数える", ok: false, note: "泊数ではなく、到着日と出発日の両方を含む日数を数えています。合計が7泊の202も10日になり、残ってしまいます。" },
    ],
    takeaway: "日付の範囲も、<b>行ごとの長さを求めてから部屋ごとに合計する</b>と1つのクエリで書けます。",
  },
  {
    type: "q", sec: "4.2 カット", title: "頭文字ごとの人数", ref: "cut", table: ["persons"],
    prompt: "名簿の索引を作るため、名前の頭文字ごとに人数を数えたい。頭文字ごとに1行で人数を返すのはどれ？",
    choices: [
      { q: "initial_name", tag: "GROUP BY name", ok: false, note: "nameは主キーなので、9人がそれぞれ別のグループになります。結果は9行で、人数はすべて1です。" },
      { q: "initial_window", tag: "COUNT(*) OVER", ok: false, note: "人数は正しく出ますが、ウィンドウ関数は行をまとめないので9行のままです。" },
      { q: "initial_substr", tag: "GROUP BY SUBSTRING", ok: true, note: "GROUP BY句に式を書けば、頭文字でPersonsを切り分けられます。結果はAが2、Bが3、Cが1、Dが3です。" },
    ],
    takeaway: "<b>GROUP BY句には列名だけでなく式も書ける。</b>式の値ごとに集合を切り分けます。",
  },
  {
    type: "q", sec: "4.2 カット", title: "GROUP BYにSELECT句の別名を書く", ref: "cut", table: ["persons"],
    prompt: "年齢で子供（20歳未満）、成人（20〜69歳）、老人（70歳以上）に分けて人数を数える。GROUP BY句にCASE式をもう一度書く代わりに、SELECT句で付けた別名age_classを書いた。正しい説明はどれ？",
    choices: [
      { text: "どのDBMSでもエラーになる", ok: false, note: "PostgreSQLとMySQLでは動きます。結果タブのとおり、子供1、成人6、老人2を返します。" },
      { text: "PostgreSQLとMySQLでは動くが、標準SQLでは認められていない", ok: true, note: "標準SQLでは、GROUP BY句はSELECT句より前に評価されるので、SELECT句の別名を参照できません。PostgreSQLとMySQLは独自に許しています。" },
      { text: "CASE式の計算が1回で済むので、実行計画が軽くなる", ok: false, note: "実行計画は同じです。PostgreSQLのGroup Keyには、別名で書いた場合もCASE式がそのまま展開されています。" },
    ],
    show: [{ q: "age_case", tag: "CASE式を書く" }, { q: "age_alias", tag: "別名を書く" }], showDefault: 1,
    takeaway: "どちらもSeq ScanとHashAggregateだけです。<b>GROUP BY句にCASE式を書いても、データを読む経路は変わらない。</b>増えるのは式を計算するCPUのコストだけです。",
  },
  {
    type: "q", sec: "4.2 カット", title: "BMIで分類する", ref: "cut", table: ["persons"], tableNote: PERSONS_NOTE,
    prompt: "BMI（体重kg÷身長mの2乗）で、18.5未満をやせ、18.5以上25未満を標準、25以上を肥満に分けて人数を数えたい。正しい結果を返すのはどれ？",
    choices: [
      { q: "bmi_cm", tag: "身長をcmのまま", ok: false, note: "身長をメートルに直していないので、BMIが1万分の1になり、全員がやせに入ります。" },
      { q: "bmi_case", tag: "CASE式で3つに分ける", ok: true, note: "身長を100で割ってから2乗します。結果はやせ2、標準4、肥満3です。" },
      { q: "bmi_order", tag: "WHENの順番違い", ok: false, note: "CASE式は最初に真になったWHENで止まります。25未満の条件を先に書いたので、やせの2人も標準に入り、標準6、肥満3になります。" },
    ],
    takeaway: "計算式とCASE式を組み合わせると、<b>複雑な基準でもGROUP BY句1つで切り分けられる。</b>",
  },
  {
    type: "q", sec: "4.2 カット", title: "年齢区分の中で順位を付ける", ref: "cut", table: ["persons"],
    prompt: "全員の行を残したまま、年齢区分（子供・成人・老人）の中で年齢の若い順に順位を付けたい。正しい結果を返すのはどれ？",
    choices: [
      { q: "rank_nopart", tag: "PARTITION BYなし", ok: false, note: "全員を1つの集合として順位を付けるので、老人のBatesは8位になります。" },
      { q: "rank_age", tag: "PARTITION BY age", ok: false, note: "年齢ごとに切り分けるので、どのパーティションでも自分が1位です。30歳の2人も同じパーティションで、どちらも1位です。" },
      { q: "rank_case", tag: "PARTITION BY CASE", ok: true, note: "PARTITION BY句にもCASE式を書けます。成人のAndersonとDonaldはどちらも30歳なので3位で、次のBillは5位です。" },
    ],
    takeaway: "<b>PARTITION BY句は、GROUP BY句から集約を取り除いてカットだけを残したもの。</b>9行すべてが残ります。実行計画では、CASE式とageでSortしてからWindowAggで順位を付けています。",
  },
  { type: "end" },
];

const INTRO_BODY = {
  plan: () => {
    const r = analyze(D.agg_case_max.pg, "pg");
    return `<div class="grid">
      <div class="col">
        <p class="prompt">SQLには欲しいデータの条件だけを書きます。データをどの順にどう読むかはDBMSのオプティマイザが決め、その手順を実行計画と呼びます。実行計画は木の形をしていて、インデントの深い行から先に実行します。</p>
        <div class="label">GROUP BYの2つのやり方</div>
        <div class="tbl-wrap" style="max-height:none"><table>
          <thead><tr><th>やり方</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
          <tbody>
            <tr><td>集約キーのハッシュ値でグループを作る</td><td>HashAggregate</td><td>Aggregate using temporary table</td></tr>
            <tr><td>集約キーの順に並べてから区切る</td><td>Sort → GroupAggregate</td><td>Group aggregate</td></tr>
          </tbody></table></div>
        <p class="prompt">ハッシュもソートもワーキングメモリを使います。メモリが足りないとストレージに書き出し（TEMP落ち）、大きく遅くなります。</p>
      </div>
      <div class="col">
        <div class="label">例：1人の情報を1行にまとめる（Q1の正解）</div>
        <div class="label">PostgreSQLの実行計画</div>
        <pre class="plan">${r.html}</pre>
        <ol class="points">
          <li>Seq ScanでNonAggTblの全9行を読みます。</li>
          <li>HashAggregateがidのハッシュ値で3つのグループを作ります。Batches: 1は、メモリ内で処理が終わったことを表します。</li>
          <li>MySQLは主キー（id, data_type）の順に読むので、並べ直さずにGroup aggregateで区切っています。本書のMySQLの計画（temporary table）とは違います。</li>
        </ol>
        <div class="legend"><span class="lf">テーブルを全件読む行</span><span class="li">インデックスで探す行</span></div>
      </div>
    </div>`;
  },
  agg: () => `<div class="grid">
      <div class="col">
        <div class="label">集約関数</div>
        <ul class="points">
          <li>標準SQLの集約関数はCOUNT、SUM、AVG、MAX、MINの5つです。複数の行を1つの値にまとめます。</li>
          <li>COUNT(*)以外の集約関数はNULLを無視します。</li>
          <li>集約関数の中にCASE式を書くと、条件に合う行の値だけを集計できます。例：<code>MAX(CASE WHEN data_type = 'A' THEN data_1 END)</code></li>
        </ul>
        <div class="label">GROUP BYした後のSELECT句に書けるもの</div>
        <ul class="points">
          <li>定数</li>
          <li>GROUP BY句に書いた集約キー</li>
          <li>集約関数</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">句を評価する順番</div>
        <div class="row">${["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY"].map(w => `<span class="chip pages">${w}</span>`).join("<span class=\"hint\">→</span>")}</div>
        <ul class="points">
          <li>WHERE句は集約の前に行を絞ります。集約関数はWHERE句に書けません。</li>
          <li>HAVING句は集約の後に、グループを絞ります。</li>
        </ul>
        <div class="label">GROUP BY句がする2つの操作</div>
        <ul class="points">
          <li><b>カット</b>：テーブルを、集約キーの値ごとの小さな集合に切り分ける</li>
          <li><b>集約</b>：切り分けた集合を、それぞれ1行にまとめる</li>
        </ul>
      </div>
    </div>`,
  cut: () => `<div class="grid">
      <div class="col">
        <div class="label">パーティション（類）</div>
        <ul class="points">
          <li>GROUP BYで切り分けた集合を、数学では類（partition）と呼びます。互いに重なる要素を持ちません。</li>
          <li>GROUP BY句には、列名だけでなく式も書けます。式の値ごとに切り分けられます。例：<code>GROUP BY SUBSTRING(name, 1, 1)</code></li>
          <li>CASE式を書けば、年齢区分のような任意の基準で切り分けられます。標準SQLでは、同じCASE式をSELECT句とGROUP BY句の両方に書きます。</li>
        </ul>
      </div>
      <div class="col">
        <div class="label">GROUP BY句とPARTITION BY句</div>
        ${pre("-- 区分ごとに1行\nSELECT 区分, COUNT(*) FROM Persons GROUP BY 区分;\n\n-- 元の行を残したまま、区分の中で順位を付ける\nSELECT name, RANK() OVER(PARTITION BY 区分 ORDER BY age)\n  FROM Persons;")}
        <ul class="points">
          <li>ウィンドウ関数のPARTITION BY句は、GROUP BY句から集約を取り除き、カットだけを残したものです。</li>
          <li>行をまとめないので、元のテーブルの行がすべて残ります。</li>
          <li>PARTITION BY句にも、式やCASE式を書けます。</li>
        </ul>
      </div>
    </div>`,
};

const CH = {
  no: 4,
  store: "sql-jissen-ch4-drill-v1",
  h1: "集約とカット<br>集合の世界",
  lede: () => `GROUP BY句の集約とカットを${QUESTIONS.length}問で確かめます。選択肢を選ぶと、そのクエリの実行計画と結果が表示されます。行がいくつのグループにまとまったかを比べてください。`,
  points: [
    "GROUP BY句とウィンドウ関数のPARTITION BY句は、集合をカットしている。",
    "GROUP BY句やウィンドウ関数は、内部でハッシュかソートを使っている。",
    "ハッシュやソートはメモリを多く使う。メモリが足りないとストレージに書き出し、遅くなる。",
    "GROUP BY句やウィンドウ関数とCASE式を組み合わせると、非常に強力に表現できる。",
  ],
};
