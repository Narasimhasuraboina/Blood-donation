// frontend/src/components/RequestList.js (Updated for Conditional Filtering)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API endpoints
const API_URL_PUBLIC = 'http://localhost:5000/api/request/active'; 
const API_URL_FILTERED = 'http://localhost:5000/api/request/filtered'; 

function RequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const token = localStorage.getItem('token'); // Check for token
    const isLoggedin = !!token;

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const apiUrl = isLoggedin ? API_URL_FILTERED : API_URL_PUBLIC;
            
            try {
                const config = isLoggedin ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(apiUrl, config);
                
                setRequests(response.data);
                setError('');
            } catch (err) {
                const errorMessage = isLoggedin 
                    ? 'Failed to fetch personalized requests. Token may be expired.'
                    : 'Failed to fetch public requests. Server may be down.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [isLoggedin, token]); // Re-run when login status changes

    if (loading) return <p style={styles.message}>Loading Active Requests...</p>;
    if (error) return <p style={styles.errorMessage}>{error}</p>;
    
    const headerText = isLoggedin 
        ? `🩸 Personalized Requests (${requests.length})` 
        : `🩸 Public Blood Requests (${requests.length})`;
        
    if (requests.length === 0) {
        const emptyMessage = isLoggedin 
            ? "No active requests currently matching your blood type." 
            : "No active public requests currently.";
        return <p style={styles.message}>{emptyMessage}</p>;
    }


    const getUrgencyStyle = (urgency) => {
        const baseStyle = { padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
        switch (urgency) {
            case 'CRITICAL': return { ...baseStyle, color: 'white', backgroundColor: 'var(--color-error)' };
            case 'HIGH': return { ...baseStyle, color: 'white', backgroundColor: '#e67e22' };
            case 'MEDIUM': return { ...baseStyle, color: '#333', backgroundColor: '#f1c40f' };
            default: return { ...baseStyle, color: 'var(--color-text)', backgroundColor: 'var(--color-input-bg)' };
        }
    };

    // --- JSX (List Display) ---
    return (
        <div style={styles.container}>
            <h2>{headerText}</h2>
            <div style={styles.listContainer}>
                {requests.map((request) => (
                    <div key={request.request_id} style={styles.requestItem}>
                        <p style={styles.bloodType}>
                            {request.requested_blood_type}
                            <span style={styles.units}> (Need {request.units_required} Units)</span>
                        </p>
                        <p><strong>Hospital:</strong> {request.hospital_name}</p>
                        <p style={styles.details}>
                            <span style={getUrgencyStyle(request.urgency_level)}>{request.urgency_level}</span>
                            <span>Requested: {new Date(request.request_date).toLocaleDateString()}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '50px auto', padding: '20px', backgroundColor: 'var(--color-card-bg)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
    requestItem: { padding: '15px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-input-bg)', transition: 'background-color 0.3s' },
    bloodType: { fontSize: '1.4em', fontWeight: 'bold', color: 'var(--color-error)', marginBottom: '5px' },
    units: { fontSize: '0.8em', fontWeight: 'normal', color: 'var(--color-tab-inactive)' },
    details: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9em' },
    errorMessage: { color: 'var(--color-error)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '4px' },
    message: { color: 'var(--color-text)', textAlign: 'center' }
};

export default RequestList;