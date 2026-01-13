// frontend/src/components/DonorList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api`;

function DonorList() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("Login required to view the full donor list.");
            setLoading(false);
            return;
        }

        const fetchDonors = async () => {
            try {
                const response = await axios.get(
                    `${API}/profile/all-donors`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDonors(response.data);
                setError("");
            } catch (err) {
                setError(
                    "Access denied or session expired. Cannot load donor list."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, [token]);

    if (!token) {
        return (
            <p style={styles.warningMessage}>
                🔒 Admin View: Log in to see the list of all donors.
            </p>
        );
    }

    if (loading) {
        return <p style={styles.message}>Loading all donors…</p>;
    }

    if (error) {
        return <p style={styles.errorMessage}>{error}</p>;
    }

    if (donors.length === 0) {
        return <p style={styles.message}>No registered donors found.</p>;
    }

    return (
        <div style={styles.container}>
            <h2>📋 Registered Donors List ({donors.length})</h2>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Blood</th>
                        <th style={styles.th}>City</th>
                        <th style={styles.th}>Phone</th>
                    </tr>
                </thead>

                <tbody>
                    {donors.map((donor) => (
                        <tr key={donor.donor_id}>
                            <td style={styles.td}>
                                {donor.first_name} {donor.last_name}
                            </td>
                            <td style={styles.tdBlood}>
                                {donor.blood_type}
                            </td>
                            <td style={styles.td}>
                                {donor.city || "N/A"}
                            </td>
                            <td style={styles.td}>
                                {donor.phone_number || "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "100%",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "var(--color-card-bg)",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "15px",
    },
    th: {
        borderBottom: "2px solid var(--color-border)",
        padding: "10px",
        textAlign: "left",
        backgroundColor: "var(--color-input-bg)",
        color: "var(--color-text)",
    },
    td: {
        borderBottom: "1px solid var(--color-border)",
        padding: "10px",
    },
    tdBlood: {
        borderBottom: "1px solid var(--color-border)",
        padding: "10px",
        fontWeight: "bold",
        color: "var(--color-error)",
    },
    warningMessage: {
        color: "var(--color-primary)",
        backgroundColor: "var(--color-input-bg)",
        padding: "10px",
        borderRadius: "4px",
        textAlign: "center",
    },
    errorMessage: {
        color: "var(--color-error)",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        padding: "10px",
        borderRadius: "4px",
        textAlign: "center",
    },
    message: {
        color: "var(--color-text)",
        textAlign: "center",
    },
};

export default DonorList;
