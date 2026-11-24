import joblib
import re
import os

from priority_engine import calculate_priority


# -----------------------------
# Model paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "ml", "models")


# -----------------------------
# Load ML models
# -----------------------------

category_model = joblib.load(
    os.path.join(MODEL_DIR, "category_model.pkl")
)

category_vectorizer = joblib.load(
    os.path.join(MODEL_DIR, "category_vectorizer.pkl")
)

severity_model = joblib.load(
    os.path.join(MODEL_DIR, "severity_model.pkl")
)

severity_vectorizer = joblib.load(
    os.path.join(MODEL_DIR, "severity_vectorizer.pkl")
)


# -----------------------------
# Text cleaning
# -----------------------------

def clean_text(text):

    text = str(text).lower()

    text = re.sub(
        r"[^a-zA-Z\s]",
        "",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text


# -----------------------------
# CivicFlow prediction
# -----------------------------

def civicflow_predict(
    complaint,
    people_affected,
    previous_complaints,
    near_school,
    near_hospital,
    traffic_level,
    location_type
):

    # Clean complaint
    cleaned_complaint = clean_text(complaint)

    # -------------------------
    # Category prediction
    # -------------------------

    category_input = category_vectorizer.transform(
        [cleaned_complaint]
    )

    category = category_model.predict(
        category_input
    )[0]

    # -------------------------
    # Severity prediction
    # -------------------------

    severity_input = severity_vectorizer.transform(
        [cleaned_complaint]
    )

    severity = severity_model.predict(
        severity_input
    )[0]

    # -------------------------
    # Priority calculation
    # -------------------------

    priority_score, priority_level = calculate_priority(
        severity,
        people_affected,
        previous_complaints,
        near_school,
        near_hospital,
        traffic_level,
        location_type
    )

    # -------------------------
    # Return result
    # -------------------------

    return {
        "complaint": complaint,
        "category": category,
        "severity": severity,
        "priority_score": priority_score,
        "priority_level": priority_level,
        "location_type": location_type
    }