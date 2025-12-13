// frontend/src/pages/RequestPage.js
import React from 'react';
import BloodRequest from '../components/BloodRequest'; 

function RequestPage() {
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>🚨 Submit Urgent Blood Request</h1>
            <p style={styles.info}>Use this form to urgently request blood from local donors. The request will be visible immediately on the portal.</p>
            
            <BloodRequest />
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s',
    },
    header: {
        textAlign: 'center',
        color: 'var(--color-error)',
        marginBottom: '20px',
        borderBottom: '2px solid var(--color-border)',
        paddingBottom: '10px'
    },
    info: {
        textAlign: 'center',
        marginBottom: '30px',
        color: 'var(--color-text)',
    }
};

export default RequestPage;