def calculate_priority(
    severity,
    people_affected,
    previous_complaints,
    near_school,
    near_hospital,
    traffic_level,
    location_type
):
    score = 0

    # Severity
    severity_points = {
        "Low": 10,
        "Medium": 25,
        "High": 40
    }

    score += severity_points.get(severity, 10)

    # People affected
    if people_affected >= 300:
        score += 20
    elif people_affected >= 200:
        score += 16
    elif people_affected >= 100:
        score += 12
    elif people_affected >= 50:
        score += 8
    else:
        score += 4

    # Previous complaints
    if previous_complaints >= 8:
        score += 15
    elif previous_complaints >= 5:
        score += 12
    elif previous_complaints >= 3:
        score += 8
    elif previous_complaints >= 1:
        score += 4

    # Sensitive locations
    if near_school == "Yes":
        score += 10

    if near_hospital == "Yes":
        score += 10

    # Traffic
    if traffic_level == "High":
        score += 5
    elif traffic_level == "Medium":
        score += 3
    else:
        score += 1

    # Maximum score
    score = min(score, 100)

    # Priority level
    if score >= 80:
        priority_level = "Critical"
    elif score >= 60:
        priority_level = "High"
    elif score >= 40:
        priority_level = "Medium"
    else:
        priority_level = "Low"

    return score, priority_level