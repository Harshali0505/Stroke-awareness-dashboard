from __future__ import annotations

from pathlib import Path

from utils import percent, save_json
import pandas as pd


def generate(df, out_dir: Path):
    risks = df["risk_factors"].dropna().astype(str).str.split(",")
    # Clean and explode the list strings
    risks = df["risk_factors"].dropna().astype(str).str.split(",")
    valid_risks = risks.explode().astype(str).str.strip()
    
    # Exclude empty strings and 'no_response' if they shouldn't skew the percentages
    valid_risks = valid_risks[valid_risks != ""]
    
    risk_counts = valid_risks.value_counts()
    total_participants = len(df)
    
    # Calculate percentage as occurrences out of total participants, not total answers
    risk_identification_data = []
    for r, count in risk_counts.items():
        if r in ["no_response", "other", "unaware", ""]:
            continue
        risk_identification_data.append({
            "risk": r,
            "count": int(count),
            "percentage": round((count / total_participants) * 100, 2)
        })
        
    save_json(out_dir, "risk-identification.json", risk_identification_data)

    risk_gap_data = []
    for r, count in risk_counts.items():
        if r in ["no_response", "other", "unaware", ""]:
            continue
        p = round((count / total_participants) * 100, 2)
        risk_gap_data.append({
            "risk": r,
            "identified_count": int(count),
            "identified_percent": p,
            "not_identified_percent": round(100 - p, 2),
        })
        
    save_json(out_dir, "risk-gap.json", risk_gap_data)

    # -------- Depth of Recall --------
    def parse_risks(val):
        if pd.isna(val) or str(val).lower() == "unaware":
            return []
        # Filter out empty strings if any
        return [r for r in str(val).split(",") if r.strip()]

    df["_parsed_risks"] = df["risk_factors"].apply(parse_risks)
    df["_risk_recall_count"] = df["_parsed_risks"].apply(len)
    
    risk_depth_counts = df["_risk_recall_count"].value_counts().to_dict()
    total_participants = len(df)
    
    risk_depth_data = []
    # Maximum observed risks or up to 7, similar to symptoms
    max_risks = df["_risk_recall_count"].max() if not df.empty else 0
    
    for i in range(0, int(max_risks) + 1):
        count = risk_depth_counts.get(i, 0)
        risk_depth_data.append({
            "risk_count": i,
            "count": int(count),
            "percentage": round((count / total_participants) * 100, 2) if total_participants > 0 else 0
        })

    save_json(out_dir, "risk-recall-depth.json", risk_depth_data)
    
    df.drop(columns=["_parsed_risks", "_risk_recall_count"], inplace=True)
    print("✅ Risk factors generated")
