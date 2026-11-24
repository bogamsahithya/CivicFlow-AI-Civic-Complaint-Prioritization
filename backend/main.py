from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid

from prediction import civicflow_predict
from database import complaints_collection


app = FastAPI(
    title="CivicFlow API",
    description="AI-Powered Public Complaint Prioritization System",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Request model
# -----------------------------

class ComplaintRequest(BaseModel):

    complaint: str

    people_affected: int = 50

    previous_complaints: int = 0

    near_school: str = "No"

    near_hospital: str = "No"

    traffic_level: str = "Medium"

    location_type: str = "Residential"


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "CivicFlow API is running!",
        "status": "success"
    }


# -----------------------------
# Submit complaint
# -----------------------------

@app.post("/complaints")
def submit_complaint(request: ComplaintRequest):

    # Run ML prediction
    result = civicflow_predict(
        complaint=request.complaint,
        people_affected=request.people_affected,
        previous_complaints=request.previous_complaints,
        near_school=request.near_school,
        near_hospital=request.near_hospital,
        traffic_level=request.traffic_level,
        location_type=request.location_type
    )

    # Generate complaint ID
    complaint_id = "CF-" + uuid.uuid4().hex[:8].upper()

    # Create database document
    complaint_document = {
        "complaint_id": complaint_id,
        "complaint": result["complaint"],
        "category": result["category"],
        "severity": result["severity"],
        "priority_score": result["priority_score"],
        "priority_level": result["priority_level"],
        "location_type": result["location_type"],

        "people_affected": request.people_affected,
        "previous_complaints": request.previous_complaints,
        "near_school": request.near_school,
        "near_hospital": request.near_hospital,
        "traffic_level": request.traffic_level,

        "status": "Pending",

        "created_at": datetime.utcnow()
    }

    # Save to MongoDB
    complaints_collection.insert_one(
        complaint_document
    )

    # Return result
    return {
        "message": "Complaint submitted successfully",

        "complaint_id": complaint_id,

        "analysis": {
            "category": result["category"],
            "severity": result["severity"],
            "priority_score": result["priority_score"],
            "priority_level": result["priority_level"]
        },

        "status": "Pending"
    }


# -----------------------------
# Original prediction endpoint
# -----------------------------

@app.post("/predict")
def predict(request: ComplaintRequest):

    result = civicflow_predict(
        complaint=request.complaint,
        people_affected=request.people_affected,
        previous_complaints=request.previous_complaints,
        near_school=request.near_school,
        near_hospital=request.near_hospital,
        traffic_level=request.traffic_level,
        location_type=request.location_type
    )

    return result
# -----------------------------
# Get all complaints
# -----------------------------

@app.get("/complaints")
def get_complaints():

    complaints = list(
        complaints_collection.find(
            {},
            {"_id": 0}
        ).sort(
            "created_at",
            -1
        )
    )

    return {
        "count": len(complaints),
        "complaints": complaints
    }


# -----------------------------
# Get complaint by ID
# -----------------------------

@app.get("/complaints/{complaint_id}")
def get_complaint(complaint_id: str):

    complaint = complaints_collection.find_one(
        {
            "complaint_id": complaint_id
        },
        {
            "_id": 0
        }
    )

    if not complaint:

        return {
            "message": "Complaint not found"
        }

    return complaint


# -----------------------------
# Update complaint status
# -----------------------------

class StatusUpdate(BaseModel):

    status: str


@app.put("/complaints/{complaint_id}/status")
def update_complaint_status(
    complaint_id: str,
    request: StatusUpdate
):

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ]

    if request.status not in allowed_statuses:

        return {
            "message": "Invalid status",
            "allowed_statuses": allowed_statuses
        }

    result = complaints_collection.update_one(
        {
            "complaint_id": complaint_id
        },
        {
            "$set": {
                "status": request.status,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:

        return {
            "message": "Complaint not found"
        }

    return {
        "message": "Complaint status updated successfully",
        "complaint_id": complaint_id,
        "status": request.status
    }