from __future__ import annotations

from pathlib import Path

from utils import stacked_by


def generate(df, out_dir: Path):
    stacked_by(df, "age", out_dir, "age-awareness.json")
    stacked_by(df, "educational_level", out_dir, "education-awareness.json")
    stacked_by(df, "gender", out_dir, "gender-awareness.json")
    stacked_by(df, "salary", out_dir, "income-awareness.json")
