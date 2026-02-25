from __future__ import annotations

from pathlib import Path

import pandas as pd

from utils import save_json


def generate(df, out_dir: Path):
    total = int(len(df))

    df = df.copy()
    df["awareness_category"] = df["awareness_category"].astype(str).str.strip()

    dist = df["awareness_category"].value_counts()
    dist_percent = (dist / total * 100).round(2) if total else dist

    def _pick_count_and_percent(keyword: str):
        match_label = None
        for lbl in dist.index:
            if keyword in str(lbl).lower():
                match_label = lbl
                break
        if match_label is None:
            return 0, 0.0
        return int(dist.get(match_label, 0)), float(dist_percent.get(match_label, 0))

    low_count, low_percent = _pick_count_and_percent("low")
    moderate_count, moderate_percent = _pick_count_and_percent("moderate")
    high_count, high_percent = _pick_count_and_percent("high")

    score_series = df["awareness_score"].dropna()
    score_mode = score_series.mode()

    score_summary = {
        "count": int(score_series.shape[0]),
        "mean": round(float(score_series.mean()), 2),
        "median": round(float(score_series.median()), 2),
        "mode": round(float(score_mode.iloc[0]), 2) if not score_mode.empty else None,
        "std": round(float(score_series.std(ddof=1)), 2) if score_series.shape[0] > 1 else 0.0,
        "min": round(float(score_series.min()), 2) if score_series.shape[0] > 0 else None,
        "max": round(float(score_series.max()), 2) if score_series.shape[0] > 0 else None,
        "q1": round(float(score_series.quantile(0.25)), 2) if score_series.shape[0] > 0 else None,
        "q3": round(float(score_series.quantile(0.75)), 2) if score_series.shape[0] > 0 else None,
    }
    save_json(out_dir, "awareness-score-summary.json", score_summary)

    home_analytics = {
        "totalRespondents": total,
        "avgAwarenessScore": round(float(df["awareness_score"].mean()), 2)
        if total
        else None,
        "lowCount": low_count,
        "lowPercent": low_percent,
        "moderateCount": moderate_count,
        "moderatePercent": moderate_percent,
        "highCount": high_count,
        "highPercent": high_percent,
    }
    save_json(out_dir, "home-analytics.json", home_analytics)

    save_json(
        out_dir,
        "overall-awareness.json",
        [
            {
                "label": dist.index[i],
                "count": int(dist.iloc[i]),
                "percentage": float(dist_percent.iloc[i]),
            }
            for i in range(len(dist))
        ],
    )

    score_bucket = df["awareness_score"].dropna().round().astype(int)
    vc = score_bucket.value_counts().sort_index()
    if vc.shape[0] > 0:
        full_index = range(int(vc.index.min()), int(vc.index.max()) + 1)
        vc = vc.reindex(full_index, fill_value=0)

    save_json(
        out_dir,
        "awareness-score-distribution.json",
        [
            {
                "score": int(score),
                "count": int(count),
                "percentage": round((int(count) / total) * 100, 2) if total else 0,
            }
            for score, count in vc.items()
        ],
    )

    know_col = "do_you_know_what_is_a_brain_stroke?"
    if know_col in df.columns:
        know_counts = df[know_col].dropna().value_counts()
        save_json(
            out_dir,
            "know-stroke.json",
            [
                {
                    "response": str(resp),
                    "count": int(count),
                    "percentage": round((float(count) / total) * 100, 2) if total else 0,
                }
                for resp, count in know_counts.items()
            ],
        )

