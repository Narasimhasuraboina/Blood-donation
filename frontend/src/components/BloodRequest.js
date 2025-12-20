// frontend/src/components/BloodRequest.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS

const API_URL_REQUEST = 'http://localhost:5000/api/request/create';

function BloodRequest() {
    const navigate = useNavigate(); // ✅ ADD THIS

    const [formData, setFormData] = useState({
        requested_blood_type: '',
        units_required: 1,
        urgency_level: 'MEDIUM',
        hospital_name: '',
        contact_person: '',
    });

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const urgencyLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting request...');
        setIsSuccess(false);

        try {
            await axios.post(API_URL_REQUEST, formData);


            setMessage('✅ Request submitted successfully! Redirecting to login...');
            setIsSuccess(true);

            // Clear form
            setFormData({
                requested_blood_type: '',
                units_required: 1,
                urgency_level: 'MEDIUM',
                hospital_name: '',
                contact_person: '',
            });

            // ✅ Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/auth');
            }, 2000);

        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Request failed due to network error.';
            setMessage(`❌ ${errorMessage}`);
            setIsSuccess(false);
            console.error('Blood Request Error:', error);
        }
    };

    return (
        <div style={styles.container}>
            {message && (
                <p style={isSuccess ? styles.successMessage : styles.errorMessage}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <select
                    name="requested_blood_type"
                    value={formData.requested_blood_type}
                    onChange={handleChange}
                    required
                    style={styles.input}
                >
                    <option value="">Select Required Blood Type *</option>
                    {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <input
                    type="number"
                    name="units_required"
                    placeholder="Units Required *"
                    value={formData.units_required}
                    onChange={handleChange}
                    required
                    min="1"
                    style={styles.input}
                />

                <select
                    name="urgency_level"
                    value={formData.urgency_level}
                    onChange={handleChange}
                    required
                    style={styles.input}
                >
                    {urgencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                <input
                    type="text"
                    name="hospital_name"
                    placeholder="Hospital Name"
                    value={formData.hospital_name}
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    type="text"
                    name="contact_person"
                    placeholder="Contact Person / Phone"
                    value={formData.contact_person}
                    onChange={handleChange}
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    Submit Request
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: '8px',
        maxWidth: '450px',
        margin: '0 auto'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-input-bg)',
        color: 'var(--color-text)'
    },
    button: {
        padding: '12px',
        backgroundColor: 'var(--color-error)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em'
    },
    successMessage: {
        color: 'var(--color-success)',
        backgroundColor: 'rgba(39, 174, 96, 0.15)',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center'
    },
    errorMessage: {
        color: 'var(--color-error)',
        backgroundColor: 'rgba(231, 76, 60, 0.15)',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center'
    }
};

export default BloodRequest;
