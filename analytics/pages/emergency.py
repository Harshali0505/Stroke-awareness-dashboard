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
