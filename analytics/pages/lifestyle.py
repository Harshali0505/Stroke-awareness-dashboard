from __future__ import annotations

from pathlib import Path

from utils import save_json, stacked_by


def generate(df, out_dir: Path):
    for habit in ["smoking", "alcohol_consumption", "regular_physical_activity"]:
        stacked_by(df, habit, out_dir, f"{habit}-awareness.json")

    total = int(len(df))
    bmi_counts = df["bmi"].round().value_counts().sort_index()
    save_json(
        out_dir,
        "bmi-distribution.json",
        [
            {
                "bmi": int(bmi),
                "count": int(count),
                "percentage": round((count / total) * 100, 2) if total else 0,
            }
            for bmi, count in bmi_counts.items()
        ],
    )

    stacked_by(df, "range", out_dir, "bmi-awareness.json")
    stacked_by(df, "medical_history", out_dir, "medical-history-awareness.json")
