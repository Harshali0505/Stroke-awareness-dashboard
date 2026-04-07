from pathlib import Path
import pandas as pd
from utils import save_json


def generate(df: pd.DataFrame, out_dir: Path):

    # ======================================
    # 1️⃣ CLOSED-ENDED RECOGNITION
    # ======================================

    symptom_columns = {
        "Sudden confusion / trouble speaking":
        "do_you_think_sudden_confusion_,trouble_speaking_or_understanding_speech_is_a_stroke_symptom?",

        "Sudden numbness or weakness of face/arm/leg":
        "do_you_think_sudden_numbness_or_weakness_of_face,_arm_or_leg_is_a_symptom_of_stroke?",

        "Trouble seeing in one or both eyes":
        "do_you_think_trouble_seeing_in_one_or_both_the_eyes_is_a_stroke_symptom?",

        "Sudden nosebleed":
        "do_you_think_sudden_nosebleed_is_a_stroke_of_symptom?"
    }

    identification_results = []

    for label, column in symptom_columns.items():

        if column not in df.columns:
            continue

        responses = df[column].astype(str).str.strip().str.lower()
        valid_mask = responses.isin(["yes", "maybe", "no"])
        total = valid_mask.sum()

        counts = responses[valid_mask].value_counts()

        for response in ["yes", "maybe", "no"]:
            count = int(counts.get(response, 0))
            percentage = (count / total) * 100 if total > 0 else 0

            identification_results.append({
                "symptom": label,
                "response": response.capitalize(),
                "count": count,
                "percentage": round(percentage, 2),
                "total": int(total)
            })

    save_json(out_dir, "symptom-identification.json", identification_results)
    print("Symptom identification JSON generated")

    # ======================================
    # 2️⃣ OPEN-ENDED STROKE SYMPTOMS ANALYSIS
    # ======================================

    CORE_SYMPTOMS = [
        "motor_weakness",
        "speech_language_problem",
        "vision_problem",
        "severe_headache",
        "balance_coordination_problem",
        "swallowing_or_consciousness",
    ]

    if "stroke_symptoms" in df.columns:

        total_participants = len(df)

        def parse_symptoms(value):
            if pd.isna(value):
                return []

            value = str(value).strip()

            if value in ["no_response", "unaware", "other"]:
                return []

            parts = [s.strip() for s in value.split(",")]
            return [s for s in parts if s in CORE_SYMPTOMS]

        df["_parsed_symptoms"] = df["stroke_symptoms"].apply(parse_symptoms)

        # -------- Recall Frequency --------

        symptom_counts = {sym: 0 for sym in CORE_SYMPTOMS}
        no_recall_count = 0

        for symptoms in df["_parsed_symptoms"]:
            if len(symptoms) == 0:
                no_recall_count += 1
            else:
                for sym in set(symptoms):
                    symptom_counts[sym] += 1

        recall_frequency_data = []

        for sym, count in symptom_counts.items():
            recall_frequency_data.append({
                "symptom": sym,
                "count": int(count),
                "percentage": round((count / total_participants) * 100, 2)
            })

        recall_frequency_data.append({
            "symptom": "no_recall_or_unclear",
            "count": int(no_recall_count),
            "percentage": round((no_recall_count / total_participants) * 100, 2)
        })

        recall_frequency_data = sorted(
            recall_frequency_data,
            key=lambda x: x["percentage"],
            reverse=True
        )

        save_json(out_dir, "symptom-recall-frequency.json", recall_frequency_data)

        # -------- Depth of Recall --------

        df["_recall_count"] = df["_parsed_symptoms"].apply(len)

        depth_counts = df["_recall_count"].value_counts().to_dict()

        recall_depth_data = []

        for i in range(0, 7):
            count = depth_counts.get(i, 0)
            recall_depth_data.append({
                "symptom_count": i,
                "count": int(count),
                "percentage": round((count / total_participants) * 100, 2)
            })

        save_json(out_dir, "symptom-recall-depth.json", recall_depth_data)

        df.drop(columns=["_parsed_symptoms", "_recall_count"], inplace=True)

        print(" Open-ended symptom recall JSONs generated")

    # ======================================
    # 3️⃣ THE NOSEBLEED TRAP / CROSS-TAB INSIGHTS
    # ======================================
    
    confusion_col = symptom_columns.get("Sudden confusion / trouble speaking")
    numbness_col = symptom_columns.get("Sudden numbness or weakness of face/arm/leg")
    vision_col = symptom_columns.get("Trouble seeing in one or both eyes")
    nosebleed_col = symptom_columns.get("Sudden nosebleed")
    
    if all(col in df.columns for col in [confusion_col, numbness_col, vision_col, nosebleed_col]):
        total_resp = len(df)
        
        c_conf = df[confusion_col].astype(str).str.strip().str.lower()
        c_numb = df[numbness_col].astype(str).str.strip().str.lower()
        c_vis = df[vision_col].astype(str).str.strip().str.lower()
        c_nose = df[nosebleed_col].astype(str).str.strip().str.lower()
        
        # 3 True symptoms correct (Yes)
        true_symptoms_mask = (c_conf == "yes") & (c_numb == "yes") & (c_vis == "yes")
        true_symptoms_correct_count = int(true_symptoms_mask.sum())
        
        # All 4 correct (Yes to 3, No to nosebleed)
        all_four_mask = true_symptoms_mask & (c_nose == "no")
        all_four_correct_count = int(all_four_mask.sum())
        
        # False positive nosebleed
        nosebleed_yes_mask = (c_nose == "yes")
        nosebleed_yes_count = int(nosebleed_yes_mask.sum())
        
        trap_data = {
            "total_participants": total_resp,
            "three_symptoms_correct": true_symptoms_correct_count,
            "all_four_correct": all_four_correct_count,
            "all_four_percentage": round((all_four_correct_count / total_resp) * 100, 2) if total_resp else 0,
            "trap_percentage": round((all_four_correct_count / true_symptoms_correct_count) * 100, 2) if true_symptoms_correct_count else 0,
            "nosebleed_yes_count": nosebleed_yes_count,
            "nosebleed_yes_percentage": round((nosebleed_yes_count / total_resp) * 100, 2) if total_resp else 0,
        }
        
        save_json(out_dir, "symptom-trap.json", trap_data)
        print("Symptom trap JSON generated")