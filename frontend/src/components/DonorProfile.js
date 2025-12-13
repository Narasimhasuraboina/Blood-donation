// frontend/src/components/DonorProfile.js (Dashboard View & Eligibility Logic)
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DonationLog from './DonationLog'; 

const API_URL_PROFILE = 'http://localhost:5000/api/profile/profile'; 
const API_URL_UPDATE = 'http://localhost:5000/api/profile/update'; 
const API_URL_HISTORY = 'http://localhost:5000/api/donation/history'; 

function DonorProfile({ onLogout }) {
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]); 
    const [eligibility, setEligibility] = useState(null); // New state for eligibility
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({}); 
    const [updateMessage, setUpdateMessage] = useState('');

    const token = localStorage.getItem('token');

    const fetchProfileAndHistory = useCallback(async () => {
        setLoading(true);
        if (!token) {
            setError('Please log in to view your profile.');
            setLoading(false);
            return;
        }

        try {
            const profileResponse = await axios.get(API_URL_PROFILE, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const historyResponse = await axios.get(API_URL_HISTORY, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setProfile(profileResponse.data);
            setHistory(historyResponse.data.history);
            setEligibility(historyResponse.data.eligibility); // Set eligibility state
            
            setFormData({ 
                first_name: profileResponse.data.first_name,
                last_name: profileResponse.data.last_name,
                date_of_birth: profileResponse.data.date_of_birth ? new Date(profileResponse.data.date_of_birth).toISOString().split('T')[0] : '', 
                phone_number: profileResponse.data.phone_number,
                city: profileResponse.data.city,
            });
            setError('');

        } catch (err) {
            setError('Failed to load dashboard. Your session may have expired.');
            localStorage.removeItem('token');
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
        setUpdateMessage('Updating...');

        try {
            await axios.put(API_URL_UPDATE, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUpdateMessage('Profile updated successfully!');
            setIsEditing(false); 
            fetchProfileAndHistory(); 

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Update failed.';
            setUpdateMessage(`Error: ${errorMessage}`);
        }
    };
    
    const handleLogout = () => {
        if (onLogout) onLogout();
        // Since App.js now handles state change and routing, we don't need window.location.reload()
    };


    if (loading) return <p style={styles.message}>Loading Dashboard...</p>;
    if (error && !token) return <p style={styles.errorMessage}>🔒 {error}</p>;
    if (!profile) return <p style={styles.message}>Dashboard data unavailable. Please log in.</p>;

    const formattedDate = profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A';
    const isEligible = eligibility?.isEligible;

    return (
        <div style={styles.container}>
            
            {/* Eligibility Status Banner */}
            {eligibility && (
                <div style={isEligible ? styles.eligibleBanner : styles.ineligibleBanner}>
                    {isEligible ? (
                        <p>✅ **You are currently eligible to donate!** Thank you for your continued support.</p>
                    ) : (
                        <p>
                            ❌ **Not yet eligible.** Next donation: 
                            **{new Date(eligibility.nextDonationDate).toLocaleDateString()}** (Wait: {eligibility.daysWait} days).
                        </p>
                    )}
                </div>
            )}

            <h2>👤 Donor Profile Dashboard</h2>
            
            {updateMessage && (
                <p style={updateMessage.startsWith('Error') ? styles.errorMessage : styles.successMessage}>
                    {updateMessage}
                </p>
            )}

            {!isEditing ? (
                // --- VIEW MODE ---
                <div style={styles.section}>
                    <h3 style={styles.sectionHeader}>Your Details</h3>
                    <div style={styles.profileDetail}>
                        <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Blood Type:</strong> <span style={styles.bloodType}>{profile.blood_type}</span></p>
                        <p><strong>Date of Birth:</strong> {formattedDate}</p>
                        <p><strong>City:</strong> {profile.city || 'N/A'}</p>
                        <p><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
                    </div>
                    
                    <div style={styles.buttonRow}>
                        <button onClick={() => setIsEditing(true)} style={styles.editButton}>Edit Profile</button>
                        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                    </div>

                    <h3 style={{...styles.sectionHeader, marginTop: '30px'}}>Donation History ({history.length})</h3>
                    <div style={styles.historyContainer}>
                        {history.length > 0 ? (
                            history.map((donation) => (
                                <div key={donation.donation_id} style={styles.historyItem}>
                                    <span>{new Date(donation.donation_date).toLocaleDateString()}</span>
                                    <span>{donation.quantity_ml} ml</span>
                                    <span style={styles.historyLocation}>{donation.location || 'Unknown Location'}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{fontSize: '0.9em', color: 'var(--color-tab-inactive)'}}>No past donations recorded yet.</p>
                        )}
                    </div>
                    
                    <DonationLog onDonationLogged={fetchProfileAndHistory} />
                </div>

            ) : (
                // --- EDIT MODE ---
                <form onSubmit={handleUpdate} style={styles.form}>
                    <input type="text" name="first_name" placeholder="First Name" value={formData.first_name || ''} onChange={handleChange} style={styles.input} />
                    <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name || ''} onChange={handleChange} style={styles.input} />
                    <input type="date" name="date_of_birth" placeholder="Date of Birth" value={formData.date_of_birth || ''} onChange={handleChange} style={styles.input} />
                    <input type="tel" name="phone_number" placeholder="Phone Number" value={formData.phone_number || ''} onChange={handleChange} style={styles.input} />
                    <input type="text" name="city" placeholder="City" value={formData.city || ''} onChange={handleChange} style={styles.input} />

                    <div style={styles.buttonRow}>
                        <button type="submit" style={styles.saveButton}>Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setUpdateMessage(''); }} style={styles.cancelButton}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '100%', padding: '20px', backgroundColor: 'var(--color-card-bg)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    section: { padding: '5px' },
    sectionHeader: { borderBottom: '2px solid var(--color-border)', paddingBottom: '5px', marginBottom: '15px', color: 'var(--color-primary)' },
    profileDetail: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', backgroundColor: 'var(--color-input-bg)', borderRadius: '6px' },
    historyContainer: { display: 'flex', flexDirection: 'column', gap: '8px' },
    historyItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: 'var(--color-input-bg)', borderRadius: '4px', fontSize: '0.9em' },
    historyLocation: { fontStyle: 'italic', color: 'var(--color-tab-inactive)', maxWidth: '40%' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', padding: '15px', backgroundColor: 'var(--color-input-bg)', borderRadius: '6px' },
    input: { padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' },
    bloodType: { fontWeight: 'bold', color: 'var(--color-error)', fontSize: '1.1em' },
    errorMessage: { color: 'var(--color-error)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '4px', textAlign: 'center' },
    successMessage: { color: 'var(--color-success)', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '10px', borderRadius: '4px', textAlign: 'center' },
    buttonRow: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', gap: '10px' },
    editButton: { padding: '10px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 },
    saveButton: { padding: '10px', backgroundColor: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 },
    cancelButton: { padding: '10px', backgroundColor: 'var(--color-tab-inactive)', color: 'var(--color-text)', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 },
    logoutButton: { padding: '10px', backgroundColor: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 },
    message: { color: 'var(--color-text)', padding: '10px' },
    eligibleBanner: { padding: '15px', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' },
    ineligibleBanner: { padding: '15px', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' },
};

export default DonorProfile;