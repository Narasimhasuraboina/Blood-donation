// frontend/src/pages/DashboardPage.js
import React from 'react';
import DonorProfile from '../components/DonorProfile'; 
import DonorList from '../components/DonorList';
import RequestList from '../components/RequestList';

function DashboardPage({ onLogout }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <p style={{textAlign: 'center', marginTop: '100px', fontSize: '1.2em', color: 'var(--color-error)'}}>
            Access Denied. Please log in to view the dashboard.
        </p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>User Dashboard & Portal</h1>
            
            {/* 1. Protected/Admin View */}
            <DonorList />
            
            <hr style={styles.divider} />
            
            {/* 2. Primary Protected User Component */}
            <DonorProfile onLogout={onLogout} /> 
            
            <hr style={styles.divider} />
            
            {/* 3. Public View - Included here for reference */}
            <RequestList />

        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
        color: 'var(--color-primary)', 
        marginBottom: '30px',
        borderBottom: '3px solid var(--color-border)',
        paddingBottom: '10px'
    },
    divider: {
        margin: '50px 0',
        border: '0',
        borderTop: '1px solid var(--color-border)'
    }
};

export default DashboardPage;