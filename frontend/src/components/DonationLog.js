// frontend/src/components/DonationLog.js
import React, { useState } from 'react';
import axios from 'axios';

const API_URL_LOG = 'http://localhost:5000/api/donation/log'; 

function DonationLog({ onDonationLogged }) { 
    const [formData, setFormData] = useState({
        donation_date: new Date().toISOString().split('T')[0], 
        quantity_ml: 450, 
        location: '',
    });

    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    
    if (!token) {
        return null; // Only show if logged in
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logging Donation...'); 

        try {
            await axios.post(API_URL_LOG, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessage('Success! Donation logged.');
            setFormData({ ...formData, location: '' }); 
            
            if (onDonationLogged) {
                onDonationLogged(); 
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Donation logging failed due to server error.';
            setMessage(`Error: ${errorMessage}`);
        }
    };

    return (
        <div style={styles.container}>
            <h3>➕ Record New Donation</h3>
            
            {message && (
                <p style={message.startsWith('Error') ? styles.errorMessage : styles.successMessage}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Donation Date</label>
                <input 
                    type="date" 
                    name="donation_date" 
                    value={formData.donation_date} 
                    onChange={handleChange} 
                    required 
                    style={styles.input} 
                />

                <label style={styles.label}>Quantity (ml)</label>
                <input 
                    type="number" 
                    name="quantity_ml" 
                    value={formData.quantity_ml} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    style={styles.input} 
                />
                
                <label style={styles.label}>Location</label>
                <input 
                    type="text" 
                    name="location" 
                    placeholder="e.g., City General Hospital" 
                    value={formData.location} 
                    onChange={handleChange} 
                    style={styles.input} 
                />

                <button type="submit" style={styles.button}>Log Donation</button>
            </form>
        </div>
    );
}

const styles = {
    container: { marginTop: '30px', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-input-bg)' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '0.9em', fontWeight: 'bold', marginTop: '5px', color: 'var(--color-text)' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' },
    button: { padding: '10px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '15px' },
    successMessage: { color: 'var(--color-success)', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '10px', borderRadius: '4px', textAlign: 'center' },
    errorMessage: { color: 'var(--color-error)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '4px', textAlign: 'center' },
};

export default DonationLog;