from __future__ import annotations

from pathlib import Path

from utils import save_json


def generate(df, out_dir: Path):
    sources_col = "if_you_are_aware_of_brain_stroke,_how_did_you_learn_about_it?"
    sources = df[sources_col].dropna().astype(str).str.strip()
    source_counts = sources.value_counts()

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

    # ----------------------------------------------------
    # Breakdown by awareness_category
    # ----------------------------------------------------
    if "awareness_category" in df.columns:
        stacked_data = []
        # Create a new df
        df_exploded = df[[sources_col, "awareness_category"]].copy().dropna()
        df_exploded[sources_col] = df_exploded[sources_col].astype(str).str.strip()
        
        # Group by source and awareness category
        grouped = df_exploded.groupby([sources_col, "awareness_category"]).size().reset_index(name="count")
        
        # Calculate within-source percentages
        for source in df_exploded[sources_col].unique():
            source_total = df_exploded[df_exploded[sources_col] == source].shape[0]
            source_rows = grouped[grouped[sources_col] == source]
            
            for _, row in source_rows.iterrows():
                cat = row["awareness_category"]
                cnt = row["count"]
                stacked_data.append({
                    "source": source,
                    "category": cat,
                    "count": int(cnt),
                    "percentage": round((cnt / source_total) * 100, 2) if source_total else 0,
                    "total": int(source_total),
                })
                
        save_json(out_dir, "awareness-sources-stacked.json", stacked_data)
