import json
from pathlib import Path


def ensure_out_dir(out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    return out_dir


def save_json(out_dir: Path, name: str, data):
    ensure_out_dir(out_dir)
    with open(out_dir / name, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def percent(series):
    return (series / series.sum() * 100).round(2)


def stacked_by(df, col: str, out_dir: Path, filename: str):
    g = df.groupby([col, "awareness_category"]).size().reset_index(name="count")
    out = []
    for val in g[col].dropna().unique():
        subset = g[g[col] == val]
        total = subset["count"].sum()
        for _, row in subset.iterrows():
            out.append(
                {
                    col: val,
                    "category": row["awareness_category"],
                    "count": int(row["count"]),
                    "total": int(total),
                    "percentage": round((row["count"] / total) * 100, 2) if total else 0,
                }
            )

    save_json(out_dir, filename, out)
