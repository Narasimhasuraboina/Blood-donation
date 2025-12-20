import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [donors, setDonors] = useState([]);
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ==============================
  // FETCH FUNCTIONS
  // ==============================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile/me`, { headers });
      setProfile(res.data);
    } catch {
      setError("Failed to load profile");
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${API}/profile/all`);
      setDonors(res.data);
    } catch {
      setError("Failed to load donors");
    }
  };

  const fetchMatchingRequests = async () => {
    try {
      const res = await axios.get(`${API}/request/filtered`, { headers });
      setMatchingRequests(res.data);
    } catch (err) {
      console.error("Failed to load matching requests", err);
    }
  };

  // ==============================
  // LOAD ONCE
  // ==============================
  useEffect(() => {
    fetchProfile();
    fetchDonors();
    fetchMatchingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Dashboard & Portal</h2>

      {error && <p style={styles.error}>{error}</p>}

      {/* ===== TOP SECTION ===== */}
      <div style={styles.topRow}>
        {/* PROFILE */}
        <div style={styles.card}>
          <h3>🧑 Your Profile</h3>
          {profile && (
            <>
              <p><b>Name:</b> {profile.name}</p>
              <p><b>Blood Group:</b> {profile.blood_type}</p>
              <p><b>City:</b> {profile.city}</p>
              <p><b>Phone:</b> {profile.phone}</p>
              <p><b>Total Donations:</b> {profile.total_donations}</p>
            </>
          )}
        </div>

        {/* MATCHING REQUESTS */}
        <div style={styles.card}>
          <h3>🩸 Matching Blood Requests ({matchingRequests.length})</h3>

          {matchingRequests.length === 0 && (
            <p>No matching blood requests right now.</p>
          )}

          {matchingRequests.map((req) => (
            <div key={req.request_id} style={styles.requestItem}>
              <b>{req.requested_blood_type}</b> | {req.hospital_name}<br />
              Urgency: {req.urgency_level}
            </div>
          ))}
        </div>
      </div>

      {/* ===== GAP ===== */}
      <div style={{ marginTop: "40px" }} />

      {/* ===== DONORS LIST ===== */}
      <div style={styles.card}>
        <h3>📋 Registered Donors List</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood</th>
              <th>City</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td style={{ color: "red" }}>{d.blood_type}</td>
                <td>{d.city || "N/A"}</td>
                <td>{d.phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==============================
// STYLES
// ==============================
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px",
    color: "var(--color-text)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },
  topRow: {
    display: "flex",
    gap: "30px",
  },
  card: {
    flex: 1,
    backgroundColor: "var(--color-card-bg)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  requestItem: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "rgba(255,255,255,0.05)",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default DashboardPage;
