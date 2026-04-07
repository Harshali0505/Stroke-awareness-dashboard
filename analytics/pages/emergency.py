from __future__ import annotations

from pathlib import Path

from utils import save_json


def generate(df, out_dir: Path):
    total = int(len(df))

    # First Action
    fa_col = "first_contact_after_experiencing_symptom"
    if fa_col in df.columns:
        from utils import stacked_by
        stacked_by(df, fa_col, out_dir, "first-action-awareness.json")
        fa_counts = df[fa_col].dropna().value_counts()
        save_json(
            out_dir,
            "first-action.json",
            [
                {
                    "action": str(action),
                    "count": int(count),
                    "percentage": round((float(count) / total) * 100, 2) if total else 0,
                }
                for action, count in fa_counts.items()
            ],
        )

    # Time to Treatment
    tt_col = "how_soon_treatment_should_be_taken_after_noticing_symptoms"
    if tt_col in df.columns:
        tt_counts = df[tt_col].dropna().value_counts()
        save_json(
            out_dir,
            "time-to-treatment.json",
            [
                {
                    "time_category": str(time_cat),
                    "count": int(count),
                    "percentage": round((float(count) / total) * 100, 2) if total else 0,
                }
                for time_cat, count in tt_counts.items()
            ],
        )

    # Specialist Consultation
    sc_col = "if_you_experience_symptoms_of_warning_signs,_which_specialist_would_you_consult?"
    if sc_col in df.columns:
        sc_counts = df[sc_col].dropna().value_counts()
        save_json(
            out_dir,
            "specialist-consultation.json",
            [
                {
                    "specialist": str(spec),
                    "count": int(count),
                    "percentage": round((float(count) / total) * 100, 2) if total else 0,
                }
        for spec, count in sc_counts.items()
            ],
        )

    # Advice Given
    advice_col = "what_advice_would_you_give_for_someone_experiencing_stroke_symptoms"
    if advice_col in df.columns:
        # Split multiple advice by comma and count individual advice
        all_advice = df[advice_col].dropna().astype(str).str.split(',').explode().str.strip()
        # count occurrences
        advice_counts = all_advice.value_counts()
        total_respondents = df[advice_col].dropna().shape[0]

        save_json(
            out_dir,
            "advice-given.json",
            [
                {
                    "advice": str(adv),
                    "count": int(count),
                    "percentage": round((float(count) / total_respondents) * 100, 2) if total_respondents else 0,
                }
                for adv, count in advice_counts.items()
            ],
        )

    # Where to go
    where_to_go_col = "where_to_go_after_experiencing_symptoms_of_brain_stroke"
    if where_to_go_col in df.columns:
        where_to_go_counts = df[where_to_go_col].dropna().value_counts()
        save_json(
            out_dir,
            "where-to-go.json",
            [
                {
                    "location": str(loc),
                    "count": int(count),
                    "percentage": round((float(count) / total) * 100, 2) if total else 0,
                }
                for loc, count in where_to_go_counts.items()
            ],
        )

    # How soon to consult
    how_soon_consult_col = "how_soon_would_you_consult_a_specialist_after_experiencing_the_first_symptom?"
    if how_soon_consult_col in df.columns:
        how_soon_consult_counts = df[how_soon_consult_col].dropna().value_counts()
        save_json(
            out_dir,
            "how-soon-consult.json",
            [
                {
                    "timeframe": str(tf),
                    "count": int(count),
                    "percentage": round((float(count) / total) * 100, 2) if total else 0,
                }
                for tf, count in how_soon_consult_counts.items()
            ],
        )

    # Action Funnel + Awareness Cross-Tab
    
    # 1. Know Urgency: "immediately" in how_soon_treatment_should_be_taken_after_noticing_symptoms
    # 2. Call Emergency: "ambulance/emergency" (or similar) in first_contact_after_experiencing_symptom
    # 3. Right Place: "specialist_hospital" in where_to_go_after_experiencing_symptoms_of_brain_stroke
    
    tt_col = "how_soon_treatment_should_be_taken_after_noticing_symptoms"
    fa_col = "first_contact_after_experiencing_symptom"
    where_to_go_col = "where_to_go_after_experiencing_symptoms_of_brain_stroke"
    
    funnel_data = {}
    
    if tt_col in df.columns and fa_col in df.columns and where_to_go_col in df.columns and "awareness_score" in df.columns:
        
        # Urgency
        urgency_mask = df[tt_col].astype(str).str.lower().str.contains("immediate", na=False)
        urgency_count = urgency_mask.sum()
        funnel_data["know_urgency_pct"] = round((urgency_count / total) * 100, 1)
        
        # Call Emergency
        emerg_mask = df[fa_col].astype(str).str.lower().str.contains("emergency|ambulance", na=False)
        emerg_count = emerg_mask.sum()
        funnel_data["call_emergency_pct"] = round((emerg_count / total) * 100, 1)
        
        # Right Place
        place_mask = df[where_to_go_col].astype(str).str.lower().str.contains("hospital|clinic", na=False) 
        # Actually wait, let's just use what's generated in time-to-treatment json
        
        # Cross tab awareness x urgency
        # Moderate + High awareness
        mod_high_mask = df["awareness_score"] >= 8 # Or whatever the threshold is
        
        # We can just read the awareness distribution instead of re-calculating, or do it here.
        # "Awareness Score Category" is calculated during data prep?
        if "Awareness Score Category" in df.columns:
            mod_high_mask = df["Awareness Score Category"].isin(["Moderate Awareness", "High Awareness"])
            mod_high_count = mod_high_mask.sum()
            mod_high_pct = (mod_high_count / total) * 100
            
            mod_high_urgency = (mod_high_mask & urgency_mask).sum()
            urgency_among_aware = (mod_high_urgency / mod_high_count) * 100 if mod_high_count else 0
            
            funnel_data["mod_high_awareness_pct"] = round(mod_high_pct, 1)
            funnel_data["urgency_among_aware_pct"] = round(urgency_among_aware, 1)
            
        save_json(out_dir, "action-funnel.json", funnel_data)
