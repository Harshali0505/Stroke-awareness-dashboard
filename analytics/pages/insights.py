from __future__ import annotations

from pathlib import Path

from utils import save_json


def generate(df, out_dir: Path):
    save_json(
        out_dir,
        "awareness-vs-bmi.json",
        df[["awareness_score", "bmi"]].dropna().to_dict(orient="records"),
    )

    risk_col = None
    if "risk_score" in df.columns:
        risk_col = "risk_score"
    elif "score_risk" in df.columns:
        risk_col = "score_risk"

    if risk_col:
        save_json(
            out_dir,
            "awareness-vs-risk.json",
            df[["awareness_score", risk_col]]
            .dropna()
            .rename(columns={risk_col: "risk_score"})
            .to_dict(orient="records"),
        )
