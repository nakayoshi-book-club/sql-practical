"""章のサンプルテーブルを作り、選択肢のクエリの実行計画と結果を src/data/chNN.json に書き出す。

使い方: python3 tools/collect.py ch01
前提: README の手順で PostgreSQL 16 と MySQL 8.0 のコンテナを起動しておく。
"""
import json
import os
import pathlib
import re
import subprocess
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
PG = os.environ.get("PG_CONTAINER", "sqlquiz-pg")
MY = os.environ.get("MY_CONTAINER", "sqlquiz-my")
MY_PASSWORD = os.environ.get("MYSQL_ROOT_PASSWORD", "quiz")
RESULT_LINES = 16
NOT_EXECUTABLE = "（MySQL 8.0 の EXPLAIN ANALYZE は、1つのテーブルだけを更新する UPDATE 文の計画を表示しません）"


def run(cmd, sql):
    p = subprocess.run(cmd, input=sql, capture_output=True, text=True)
    err = "\n".join(l for l in p.stderr.splitlines() if "Using a password" not in l)
    return (p.stdout + err).rstrip()


def pg(db, sql):
    return run(["docker", "exec", "-i", PG, "psql", "-U", "postgres", "-d", db, "-X", "-q", "--pset=footer=off"], sql)


def my(db, sql, raw=False):
    opts = ["-N", "-r", "-B"] if raw else ["-t"]
    return run(["docker", "exec", "-i", MY, "mysql", "-uroot", f"-p{MY_PASSWORD}", "--default-character-set=utf8mb4", *opts, db], sql)


def pre(query, kind):
    for path in (query.with_suffix(f".pre_{kind}.sql"), query.with_suffix(".pre.sql")):
        if path.exists():
            return path.read_text().strip() + "\n"
    return ""


def pg_plan(text):
    text = re.sub(r"\n Planning:\n.*", "", text, flags=re.S)
    lines = text.splitlines()
    if len(lines) > 1 and "QUERY PLAN" in lines[0]:
        lines = lines[2:]
    return "\n".join(lines)


def my_plan(text):
    if text.startswith("ERROR"):
        return text
    if "not executable by iterator executor" in text:
        return NOT_EXECUTABLE
    # ANALYZE TABLE などの出力を除き、計画の行だけを残す。改行は \n の文字列で返ってくる
    lines = [l for l in text.splitlines() if l.startswith(("-", " "))]
    return "\n".join(lines).replace("\\n", "\n") or text


def cap(text):
    lines = text.splitlines()
    if len(lines) <= RESULT_LINES:
        return text
    return "\n".join(lines[:RESULT_LINES]) + f"\n（以下略。全{len(lines) - 2:,}行）"


def setup(chapter, sql_dir):
    pg("postgres", f"DROP DATABASE IF EXISTS {chapter};")
    pg("postgres", f"CREATE DATABASE {chapter};")
    my("mysql", f"DROP DATABASE IF EXISTS {chapter}; CREATE DATABASE {chapter};")
    for name, targets in (("setup.sql", "pg my"), ("setup_pg.sql", "pg"), ("setup_my.sql", "my")):
        path = sql_dir / name
        if not path.exists():
            continue
        sql = path.read_text()
        if "pg" in targets:
            out = pg(chapter, sql)
            if "ERROR" in out:
                sys.exit(f"{name} (PostgreSQL): {out}")
        if "my" in targets:
            out = my(chapter, sql)
            if "ERROR" in out:
                sys.exit(f"{name} (MySQL): {out}")


def restart_pg():
    subprocess.run(["docker", "restart", PG], check=True, capture_output=True)
    for _ in range(30):
        if subprocess.run(["docker", "exec", PG, "pg_isready", "-U", "postgres", "-q"]).returncode == 0:
            return
        time.sleep(1)
    sys.exit("PostgreSQL が再起動しませんでした")


def main():
    chapter = sys.argv[1]
    sql_dir = ROOT / "sql" / chapter
    config_path = sql_dir / "collect.json"
    config = json.loads(config_path.read_text()) if config_path.exists() else {}
    setup(chapter, sql_dir)

    queries = sorted(q for q in (sql_dir / "q").glob("*.sql") if ".pre" not in q.name)
    data = {}
    # 実行計画を先に全部取る。結果を取るときの INSERT やロールバックで、計画の行数が変わらないようにするため
    for q in queries:
        sql = q.read_text().strip()
        data[q.stem] = {
            "sql": sql,
            "pg": pg_plan(pg(chapter, pre(q, "pg") + f"SET max_parallel_workers_per_gather = 0; EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, SUMMARY OFF) {sql};")),
            "my": my_plan(my(chapter, pre(q, "my") + f"EXPLAIN ANALYZE {sql};", raw=True)),
        }
    for q in queries:
        d = data[q.stem]
        d["res"] = config.get("res", {}).get(q.stem) or cap(pg(chapter, pre(q, "pg") + d["sql"] + ";"))
        if q.stem in config.get("myres", []):
            d["myres"] = cap(my(chapter, pre(q, "my") + d["sql"] + ";"))
    if "resg" in config:
        for name in config["resg"]["queries"]:
            data[name]["resg"] = cap(pg(chapter, f"BEGIN; {config['resg']['pre']} {data[name]['sql']}; ROLLBACK;"))
    if "cache" in config:
        # 再起動で共有バッファを空にしてから、同じ SQL を2回実行する
        cache = config["cache"]
        restart_pg()
        for key in cache["keys"]:
            data[key] = {
                "sql": cache["sql"],
                "pg": pg_plan(pg(chapter, f"EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, SUMMARY OFF) {cache['sql']};")),
                "my": cache["my"],
                "res": "",
            }

    out = ROOT / "src" / "data" / f"{chapter}.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"{out.relative_to(ROOT)}: {len(data)} クエリ")


if __name__ == "__main__":
    main()
