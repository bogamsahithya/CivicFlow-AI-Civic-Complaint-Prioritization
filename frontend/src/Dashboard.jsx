import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ onBack }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/complaints"
      );

      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      alert("Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);

      await axios.put(
        `http://127.0.0.1:8000/complaints/${complaintId}/status`,
        {
          status: newStatus,
        }
      );

      setComplaints((currentComplaints) =>
        currentComplaints.map((item) =>
          item.complaint_id === complaintId
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Unable to update complaint status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints = complaints.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.complaint_id.toLowerCase().includes(searchText) ||
      item.complaint.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      item.priority_level === priorityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesStatus
    );
  });

  const totalComplaints = complaints.length;

  const criticalComplaints = complaints.filter(
    (item) => item.priority_level === "Critical"
  ).length;

  const highComplaints = complaints.filter(
    (item) => item.priority_level === "High"
  ).length;

  const resolvedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;
    const categoryCounts = {};

  complaints.forEach((item) => {
    categoryCounts[item.category] =
      (categoryCounts[item.category] || 0) + 1;
  });

  const statusCounts = {
    Pending: complaints.filter(
      (item) => item.status === "Pending"
    ).length,

    "In Progress": complaints.filter(
      (item) => item.status === "In Progress"
    ).length,

    Resolved: complaints.filter(
      (item) => item.status === "Resolved"
    ).length,
  };

  const priorityCounts = {
    Critical: complaints.filter(
      (item) => item.priority_level === "Critical"
    ).length,

    High: complaints.filter(
      (item) => item.priority_level === "High"
    ).length,

    Medium: complaints.filter(
      (item) => item.priority_level === "Medium"
    ).length,

    Low: complaints.filter(
      (item) => item.priority_level === "Low"
    ).length,
  };

  const maxCategoryCount = Math.max(
    ...Object.values(categoryCounts),
    1
  );

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <h1>Authority Dashboard</h1>

          <p>
            Monitor, prioritize and manage civic complaints
          </p>
        </div>

        <div className="dashboard-actions">

          <button
            onClick={onBack}
            className="back-btn"
          >
            ← Complaints
          </button>

          <button
            onClick={fetchComplaints}
            className="refresh-btn"
          >
            🔄 Refresh
          </button>

        </div>

      </div>

      {/* STATISTICS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">📋</div>

          <div>
            <span>Total Complaints</span>
            <strong>{totalComplaints}</strong>
          </div>
        </div>

        <div className="stat-card critical">
          <div className="stat-icon">🔴</div>

          <div>
            <span>Critical</span>
            <strong>{criticalComplaints}</strong>
          </div>
        </div>

        <div className="stat-card high">
          <div className="stat-icon">🟠</div>

          <div>
            <span>High Priority</span>
            <strong>{highComplaints}</strong>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">✅</div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedComplaints}</strong>
          </div>
        </div>

      </div>
{/* ANALYTICS */}
<div className="analytics-grid">

  {/* CATEGORY ANALYTICS */}
  <div className="analytics-card">

    <h2>📊 Complaints by Category</h2>

    <div className="chart-list">

      {Object.entries(categoryCounts).map(
        ([category, count]) => (

          <div className="chart-item" key={category}>

            <div className="chart-label">
              <span>{category}</span>
              <strong>{count}</strong>
            </div>

            <div className="bar-background">

              <div
                className="bar-fill"
                style={{
                  width: `${(count / maxCategoryCount) * 100}%`,
                }}
              ></div>

            </div>

          </div>

        )
      )}

    </div>

  </div>


  {/* STATUS ANALYTICS */}
  <div className="analytics-card">

    <h2>📈 Complaint Status</h2>

    <div className="status-analytics">

      <div className="analytics-stat pending-stat">
        <span>Pending</span>
        <strong>{statusCounts.Pending}</strong>
      </div>

      <div className="analytics-stat progress-stat">
        <span>In Progress</span>
        <strong>{statusCounts["In Progress"]}</strong>
      </div>

      <div className="analytics-stat resolved-stat">
        <span>Resolved</span>
        <strong>{statusCounts.Resolved}</strong>
      </div>

    </div>

    <h3>Priority Distribution</h3>

    <div className="priority-list">

      <div>
        <span>🔴 Critical</span>
        <strong>{priorityCounts.Critical}</strong>
      </div>

      <div>
        <span>🟠 High</span>
        <strong>{priorityCounts.High}</strong>
      </div>

      <div>
        <span>🟡 Medium</span>
        <strong>{priorityCounts.Medium}</strong>
      </div>

      <div>
        <span>🟢 Low</span>
        <strong>{priorityCounts.Low}</strong>
      </div>

    </div>

  </div>

</div>
      {/* FILTERS */}
      <div className="filters-card">

        <div className="filter-title">
          🔎 Search & Filter Complaints
        </div>

        <div className="filters-grid">

          <input
            type="text"
            placeholder="Search complaint or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="All">All Categories</option>
            <option value="Road/Pothole">Road/Pothole</option>
            <option value="Water/Sewage">Water/Sewage</option>
            <option value="Garbage">Garbage</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Traffic">Traffic</option>
            <option value="Public Environment">
              Public Environment
            </option>
            <option value="Public Infrastructure">
              Public Infrastructure
            </option>
            <option value="Other">Other</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="All">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>

        <div className="filter-result">
          Showing {filteredComplaints.length} of{" "}
          {complaints.length} complaints
        </div>

      </div>

      {/* COMPLAINT TABLE */}
      <div className="complaints-section">

        <div className="section-header">
          <h2>All Complaints</h2>

          <span>
            {filteredComplaints.length} records
          </span>
        </div>

        {loading ? (
          <p className="loading">
            Loading complaints...
          </p>
        ) : filteredComplaints.length === 0 ? (
          <p className="loading">
            No complaints match your filters.
          </p>
        ) : (

          <div className="complaints-table-container">

            <table className="complaints-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredComplaints.map((item) => (

                  <tr key={item.complaint_id}>

                    <td>
                      <strong>
                        {item.complaint_id}
                      </strong>
                    </td>

                    <td className="complaint-text">
                      {item.complaint}
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>
                      <span
                        className={`badge ${item.severity.toLowerCase()}`}
                      >
                        {item.severity}
                      </span>
                    </td>

                    <td>

                      <strong>
                        {item.priority_score}/100
                      </strong>

                      <br />

                      <span
                        className={`badge ${item.priority_level.toLowerCase()}`}
                      >
                        {item.priority_level}
                      </span>

                    </td>

                    <td>

                      <select
                        className={`status-select ${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        value={item.status}
                        disabled={
                          updatingId === item.complaint_id
                        }
                        onChange={(e) =>
                          updateStatus(
                            item.complaint_id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;