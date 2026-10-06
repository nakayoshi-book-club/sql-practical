// dist/ の各章を Node 上で全スライド描画し、問題がデータを正しく参照しているかを確かめる。
// 使い方: python3 tools/build.py && node tools/check.js
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
let failed = false;

for (const dir of fs.readdirSync(dist).filter(d => /^ch\d+$/.test(d)).sort()) {
  const html = fs.readFileSync(path.join(dist, dir, "index.html"), "utf8");
  const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const el = () => ({ innerHTML: "", textContent: "", disabled: false, className: "", scrollTop: 0 });
  const els = {};
  global.document = { getElementById: id => (els[id] ||= el()), addEventListener() {} };
  global.localStorage = { getItem: () => null, setItem() {} };
  try {
    const problems = new Function(script + `
      const problems = [];
      for (const s of SLIDES.filter(s => s.type === "q")) {
        for (const c of s.choices) if (c.q && !D[c.q]) problems.push("データにないクエリ: " + c.q);
        for (const x of s.show || []) if (!D[x.q]) problems.push("データにないクエリ: " + x.q);
        for (const t of s.table || []) if (!T[t]) problems.push("定義のないテーブル: " + t);
        if (s.ref && slideOf(s.ref) < 0) problems.push("基礎スライドがない: " + s.ref);
        if (s.choices.filter(c => c.ok).length !== 1) problems.push("正解が1つでない: " + s.title);
      }
      for (let i = 0; i < SLIDES.length; i++) {
        go(i);
        if (SLIDES[i].type === "q") {
          choose(0);
          for (const tab of ["plan", "res", "data"]) { view[i].tab = tab; render(); }
        }
      }
      return problems;
    `)();
    if (problems.length) {
      failed = true;
      console.error(`${dir}: NG\n  ${problems.join("\n  ")}`);
    } else {
      console.log(`${dir}: OK`);
    }
  } catch (e) {
    failed = true;
    console.error(`${dir}: 描画中にエラー\n  ${e.stack}`);
  }
}
process.exit(failed ? 1 : 0);
