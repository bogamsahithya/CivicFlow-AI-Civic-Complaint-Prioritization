import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const [formData, setFormData] = useState({
    complaint: "",
    people_affected: 50,
    previous_complaints: 0,
    near_school: "No",
    near_hospital: "No",
    traffic_level: "Medium",
    location_type: "Residential",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.complaint.trim()) {
      alert("Please enter your complaint.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/complaints",
        {
          ...formData,
          people_affected: Number(formData.people_affected),
          previous_complaints: Number(formData.previous_complaints),
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to submit complaint. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {showDashboard ? (
        <Dashboard
  onBack={() => setShowDashboard(false)}
/>
      ) : (
        <>
          {/* NAVBAR */}
          <header className="navbar">
            <div className="logo">
              Civic<span>Flow</span>
            </div>

            <div className="nav-text">
              AI-Powered Civic Complaint System
            </div>

            <button
              className="dashboard-btn"
              onClick={() => setShowDashboard(true)}
            >
              Authority Dashboard
            </button>
          </header>

          {/* MAIN CONTENT */}
          <main className="container">

            <section className="hero">
              <h1>Report a Civic Issue</h1>

              <p>
                Submit your complaint and let CivicFlow's AI analyze,
                prioritize, and route it for faster action.
              </p>
            </section>

            {/* COMPLAINT FORM */}
            <section className="card">

              <h2>Submit Complaint</h2>

              <form onSubmit={handleSubmit}>

                <label>Complaint Description</label>

                <textarea
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                  placeholder="Example: There is a huge pothole near the school causing accidents"
                  rows="5"
                />

                <div className="grid">

                  <div>
                    <label>People Affected</label>

                    <input
                      type="number"
                      name="people_affected"
                      value={formData.people_affected}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div>
                    <label>Previous Complaints</label>

                    <input
                      type="number"
                      name="previous_complaints"
                      value={formData.previous_complaints}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                </div>

                <div className="grid">

                  <div>
                    <label>Near School?</label>

                    <select
                      name="near_school"
                      value={formData.near_school}
                      onChange={handleChange}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                  <div>
                    <label>Near Hospital?</label>

                    <select
                      name="near_hospital"
                      value={formData.near_hospital}
                      onChange={handleChange}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                </div>

                <div className="grid">

                  <div>
                    <label>Traffic Level</label>

                    <select
                      name="traffic_level"
                      value={formData.traffic_level}
                      onChange={handleChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div>
                    <label>Location Type</label>

                    <select
                      name="location_type"
                      value={formData.location_type}
                      onChange={handleChange}
                    >
                      <option>Residential</option>
                      <option>School Zone</option>
                      <option>Hospital Zone</option>
                      <option>Commercial</option>
                      <option>Public Area</option>
                    </select>
                  </div>

                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Analyzing..." : "Submit Complaint"}
                </button>

              </form>

            </section>

            {/* RESULT */}
            {result && (
              <section className="result-card">

                <h2>
                  Complaint Submitted Successfully ✅
                </h2>

                <div className="result-grid">

                  <div>
                    <span>Complaint ID</span>
                    <strong>{result.complaint_id}</strong>
                  </div>

                  <div>
                    <span>Category</span>
                    <strong>{result.analysis.category}</strong>
                  </div>

                  <div>
                    <span>Severity</span>
                    <strong>{result.analysis.severity}</strong>
                  </div>

                  <div>
                    <span>Priority Score</span>
                    <strong>
                      {result.analysis.priority_score}/100
                    </strong>
                  </div>

                  <div>
                    <span>Priority Level</span>
                    <strong>
                      {result.analysis.priority_level}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>{result.status}</strong>
                  </div>

                </div>

              </section>
            )}

          </main>
        </>
      )}

    </div>
  );
}

export default App;