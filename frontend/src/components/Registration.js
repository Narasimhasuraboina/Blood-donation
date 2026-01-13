import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api`;


function Registration({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    blood_type: "",
    date_of_birth: "",
    phone_number: "",
    city: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setIsSuccess(false);

  try {
    await axios.post(`${API}/auth/register`, formData);

    setMessage("Registration successful. Redirecting to login...");
    setIsSuccess(true);

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      blood_type: "",
      date_of_birth: "",
      phone_number: "",
      city: "",
    });

    setTimeout(() => {
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    }, 2000);

  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);

    setMessage(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed (unknown error)"
    );
    setIsSuccess(false);
  }
};


  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {message && (
          <div
            style={{
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: isSuccess
                ? "rgba(39,174,96,0.15)"
                : "rgba(231,76,60,0.15)",
              color: isSuccess ? "#2ecc71" : "#e74c3c",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}

        <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={styles.input} />
        <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} style={styles.input} />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} style={styles.input} required />

        <select name="blood_type" value={formData.blood_type} onChange={handleChange} style={styles.input} required>
          <option value="">Select Blood Type</option>
          {bloodTypes.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} style={styles.input} />
        <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} style={styles.input} />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} style={styles.input} />

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: "10px 0" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-input-bg)",
    color: "var(--color-text)",
  },
  button: {
    padding: "12px",
    backgroundColor: "var(--color-primary)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
  },
};

export default Registration;
