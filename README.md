# 🚦 CivicFlow – AI-Powered Public Complaint Prioritization System

**Making cities smarter through AI-driven civic complaint analysis and prioritization.**

CivicFlow is an AI-powered web application designed to help authorities efficiently manage and prioritize public complaints. It uses Machine Learning to identify complaint categories and predict severity, while a rule-based priority engine calculates an urgency score to help authorities focus on critical civic issues.

---

## 📌 Project Overview

Citizens frequently report civic problems such as potholes, garbage accumulation, water leakage, sewage issues, damaged streetlights, and traffic-related problems.

However, manually reviewing and prioritizing these complaints can be time-consuming and inefficient.

**CivicFlow** addresses this challenge by automating complaint classification, severity prediction, and priority calculation. It provides an authority dashboard where complaints can be monitored, filtered, and managed.

## 🎯 Objectives

- Automate the classification of public complaints.
- Predict the severity of reported civic issues using Machine Learning.
- Calculate priority scores based on urgency and surrounding conditions.
- Store complaint information in a centralized database.
- Help authorities identify and address critical complaints.
- Improve transparency and efficiency in civic complaint management.

## ✨ Key Features

### 1. AI-Based Complaint Classification
Uses TF-IDF text vectorization and Logistic Regression to classify complaints into categories such as:
- Road / Pothole
- Water / Sewage
- Garbage
- Streetlight
- Traffic
- Public Environment
- Public Infrastructure
- Other

### 2. Severity Prediction
Uses a Machine Learning model to predict complaint severity:
- Low
- Medium
- High

### 3. Intelligent Priority Scoring
A rule-based priority engine calculates a score out of 100 using:
- Predicted severity
- Number of people affected
- Previous complaints in the area
- Proximity to schools
- Proximity to hospitals
- Traffic level
- Location type

Priority levels:
- Critical
- High
- Medium
- Low

### 4. Authority Dashboard
Provides a centralized interface to view and manage submitted complaints.

### 5. Complaint Management
Authorities can monitor complaint status:
- Pending
- In Progress
- Resolved

### 6. Database Integration
MongoDB Atlas stores complaint records and their associated predictions and priority information.

## 🛠️ Technologies Used

| Category | Technologies |
|---|---|
| Frontend | React.js, CSS |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| Text Processing | TF-IDF Vectorization |
| ML Algorithms | Logistic Regression |
| Database | MongoDB Atlas |
| API Communication | Axios |
| Model Storage | Joblib |
| Development Tools | VS Code, Google Colab |
| Version Control | Git, GitHub |

## 🧠 System Architecture

```text
       Citizen
          |
          v
   React Web Application
          |
          v
      FastAPI Backend
          |
          v
   Complaint Processing
          |
     +----+----+
     |         |
     v         v
Category    Severity
Prediction  Prediction
     |         |
     +----+----+
          |
          v
   Rule-Based Priority
        Engine
          |
          v
    Priority Score
          |
          v
     MongoDB Atlas
          |
          v
   Authority Dashboard
          |
          v
  Complaint Status Update
```

## ⚙️ How It Works

1. A citizen submits a complaint through the web application.
2. The backend receives and processes the complaint.
3. The category prediction model identifies the complaint type.
4. The severity prediction model estimates its severity.
5. The priority engine calculates a score based on severity and additional contextual factors.
6. The complaint details and prediction results are stored in MongoDB Atlas.
7. Authorities view, filter, and manage complaints through the dashboard.
8. Complaint status can be updated as Pending, In Progress, or Resolved.

## 📊 Machine Learning Approach

CivicFlow uses Natural Language Processing (NLP) and supervised Machine Learning for complaint analysis.

**Text Preprocessing and Feature Extraction**
- Text cleaning and normalization
- TF-IDF vectorization
- Unigram and bigram features
- Maximum of 5,000 features
- English stop-word removal

**Classification Algorithm**

Logistic Regression is used for complaint category classification and severity prediction.

**Priority Calculation**

The priority score is generated separately using a rule-based engine. It is not an ML probability or model confidence score.

**Dataset**

The project uses approximately 3,000 synthetically generated and augmented civic complaint records. The dataset includes complaint descriptions, categories, severity labels, and contextual information.

## 📁 Project Structure

```text
CivicFlow PBA project/
│
├── backend/
│   ├── main.py
│   ├── prediction.py
│   ├── priority_engine.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│   └── models/
│       ├── category_model.pkl
│       ├── category_vectorizer.pkl
│       ├── severity_model.pkl
│       └── severity_vectorizer.pkl
│
└── README.md
```

## 🚀 Installation and Setup

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/bogamsahithya/CivicFlow-AI-Civic-Complaint-Prioritization.git
```

```bash
cd CivicFlow-AI-Civic-Complaint-Prioritization
```

### 2. Backend Setup

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your MongoDB Atlas connection string in a `.env` file using the variable name expected by your backend configuration.

Example:

```env
MONGO_URI=your_mongodb_connection_string
```

**Important:** Never upload your actual `.env` file or database credentials to GitHub.

Start the backend:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔮 Future Enhancements

- GPS-based complaint location tracking.
- Image-based civic issue detection using Computer Vision.
- Real-time notifications for critical complaints.
- Interactive geographical complaint maps.
- Integration with municipal service platforms.
- Advanced analytics and complaint resolution reports.
- Multilingual complaint submission for wider accessibility.

## 🌍 Impact

CivicFlow aims to support smarter and more responsive cities by helping authorities identify urgent civic problems, organize complaints efficiently, and make better decisions using data-driven insights.

## 👩‍💻 Developer

**Bogam Sahithya**

B.Tech – Computer Science and Engineering (AI & ML)

Hyderabad, India

## 📄 License

This project is developed for academic and educational purposes.

---

**CivicFlow – Turning Public Complaints into Prioritized Civic Action.** 🚦
