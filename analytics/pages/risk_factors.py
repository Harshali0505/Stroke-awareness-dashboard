from __future__ import annotations

from pathlib import Path

from utils import percent, save_json


def generate(df, out_dir: Path):
    risks = df["risk_factors"].dropna().astype(str).str.split(",")
    risk_counts = risks.explode().astype(str).str.strip().value_counts()
    risk_percent = percent(risk_counts)

    save_json(
        out_dir,
        "risk-identification.json",
        [
            {
                "risk": r,
                "count": int(risk_counts[r]),
                "percentage": float(risk_percent[r]),
            }
            for r in risk_counts.index
        ],
    )

    save_json(
        out_dir,
        "risk-gap.json",
        [
            {
                "risk": r,
                "identified_count": int(risk_counts[r]),
                "identified_percent": float(risk_percent[r]),
                "not_identified_percent": round(100 - float(risk_percent[r]), 2),
            }
            for r in risk_counts.index
        ],
    )
