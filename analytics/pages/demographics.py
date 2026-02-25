from __future__ import annotations

from pathlib import Path

from utils import stacked_by


def generate(df, out_dir: Path):
    # Create a copy so we don't mutate the original df's age for other scripts if any
    df_demo = df.copy()
    
    # Merge 0-15 and 15-25 (or 15-30 if it exists) into a single "0-25" group
    df_demo["age"] = df_demo["age"].replace({"0-15": "0-25", "15-25": "0-25", "15-30": "0-25"})
    
    stacked_by(df_demo, "age", out_dir, "age-awareness.json")
    stacked_by(df_demo, "educational_level", out_dir, "education-awareness.json")
    stacked_by(df_demo, "gender", out_dir, "gender-awareness.json")
    stacked_by(df_demo, "salary", out_dir, "income-awareness.json")
    stacked_by(df_demo, "location", out_dir, "location-awareness.json")
