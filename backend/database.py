import os
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv

# Get the folder containing this file
BASE_DIR = Path(__file__).resolve().parent

# Explicitly load backend/.env
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in backend/.env")

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    # Actually test the MongoDB connection
    client.admin.command("ping")

    db = client["civicflow"]
    complaints_collection = db["complaints"]

    print("MongoDB connection successful!")

except Exception as e:
    print("MongoDB connection failed!")
    print("Error:", e)
    raise