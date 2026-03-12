from __future__ import annotations

from pathlib import Path
import sys

import pandas as pd

_ANALYTICS_DIR = Path(__file__).parent
if str(_ANALYTICS_DIR) not in sys.path:
    sys.path.insert(0, str(_ANALYTICS_DIR))

from pages import (  # noqa: E402
    community,
    demographics,
    emergency,
    insights,
    lifestyle,
    overview,
    risk_factors,
    symptoms,
)


def main():
    base = Path(__file__).parent
    csv_path = base / "data" / "awareness_scores_with_categories_final.csv"
    out_dir = base.parent / "public" / "analytics"

    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip()

    overview.generate(df, out_dir)
    demographics.generate(df, out_dir)
    lifestyle.generate(df, out_dir)
    symptoms.generate(df, out_dir)
    risk_factors.generate(df, out_dir)
    community.generate(df, out_dir)
    insights.generate(df, out_dir)
    emergency.generate(df, out_dir)

    print(" ALL ANALYTICS JSON FILES GENERATED SUCCESSFULLY")


if __name__ == "__main__":
    main()
