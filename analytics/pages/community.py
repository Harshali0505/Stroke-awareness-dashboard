from __future__ import annotations

from pathlib import Path

from utils import save_json


def generate(df, out_dir: Path):
    sources_col = "if_you_are_aware_of_brain_stroke,_how_did_you_learn_about_it?"
    sources = df[sources_col].dropna().astype(str).str.split(",")
    source_counts = sources.explode().astype(str).str.strip().value_counts()

    total = float(source_counts.sum())
    save_json(
        out_dir,
        "awareness-sources.json",
        [
            {
                "source": s,
                "count": int(source_counts[s]),
                "percentage": round((float(source_counts[s]) / total) * 100, 2) if total else 0,
            }
            for s in source_counts.index
        ],
    )
