// frontend/src/components/DonorProfile.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DonationLog from "./DonationLog";
import { API_BASE_URL } from "../config";

// Central API base
const API = `${API_BASE_URL}/api`;

function DonorProfile({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchProfileAndHistory = useCallback(async () => {
    setLoading(true);

    if (!token) {
      setError("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    try {
      const profileRes = await axios.get(`${API}/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const historyRes = await axios.get(`${API}/donation/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(profileRes.data);
      setHistory(historyRes.data.history || []);
      setEligibility(historyRes.data.eligibility || null);

      setFormData({
        first_name: profileRes.data.first_name,
        last_name: profileRes.data.last_name,
        date_of_birth: profileRes.data.date_of_birth
          ? new Date(profileRes.data.date_of_birth).toISOString().split("T")[0]
          : "",
        phone_number: profileRes.data.phone_number,
        city: profileRes.data.city,
      });

      setError("");
    } catch (err) {
      setError("Failed to load dashboard. Please login again.");
      localStorage.removeItem("token");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfileAndHistory();
  }, [fetchProfileAndHistory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateMessage("Updating...");

    try {
      await axios.put(`${API}/profile/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUpdateMessage("Profile updated successfully!");
      setIsEditing(false);
      fetchProfileAndHistory();
    } catch (err) {
      setUpdateMessage(
        err.response?.data?.message || "Profile update failed."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error && !token) return <p>{error}</p>;
  if (!profile) return <p>No profile data.</p>;

  const isEligible = eligibility?.isEligible;

  return (
    <div style={styles.container}>
      {eligibility && (
        <div
          style={isEligible ? styles.eligibleBanner : styles.ineligibleBanner}
        >
          {isEligible ? (
            <p>✅ You are eligible to donate</p>
          ) : (
            <p>
              ❌ Not eligible until{" "}
              {new Date(eligibility.nextDonationDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <h2>Donor Dashboard</h2>

      {updateMessage && <p>{updateMessage}</p>}

      {!isEditing ? (
        <>
          <p>
            <b>Name:</b> {profile.first_name} {profile.last_name}
          </p>
          <p>
            <b>Email:</b> {profile.email}
          </p>
          <p>
            <b>Blood:</b> {profile.blood_type}
          </p>
          <p>
            <b>City:</b> {profile.city || "N/A"}
          </p>

          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleLogout}>Logout</button>

          <h3>Donation History</h3>
          {history.map((d) => (
            <div key={d.donation_id}>
              {new Date(d.donation_date).toLocaleDateString()} — {d.quantity_ml}
              ml
            </div>
          ))}

          <DonationLog onDonationLogged={fetchProfileAndHistory} />
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            placeholder="First name"
          />
          <input
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            placeholder="Last name"
          />
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ""}
            onChange={handleChange}
          />
          <input
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            placeholder="Phone"
          />
          <input
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="City"
          />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  eligibleBanner: {
    background: "green",
    color: "white",
    padding: "10px",
    marginBottom: "10px",
  },
  ineligibleBanner: {
    background: "red",
    color: "white",
    padding: "10px",
    marginBottom: "10px",
  },
};

export default DonorProfile;
